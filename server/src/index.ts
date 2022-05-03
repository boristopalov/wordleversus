import "reflect-metadata";
import { Server } from "socket.io";
import express from "express";
import http from "http";
import cors from "cors";
import {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from "./types/Sockets";
import { getActiveRooms } from "./utils/getActiveRooms";
import { v4 as uuidv4 } from "uuid";
import { buildSchema } from "type-graphql";
import { graphqlHTTP } from "express-graphql";
import UserResolver from "./resolvers/UserResolver";
// import Context from "./types/Context";
import db from "./db/connection";
import session, { Session } from "express-session";
import { SESSION_SECRET } from "./config";
import Redis from "ioredis";
import GameResolver from "./resolvers/GameResolver";

declare module "http" {
  interface IncomingMessage {
    session: Session & {
      userId: number;
    };
  }
}

const main = async () => {
  const RedisStore = require("connect-redis")(session);
  const redisClient: Redis = new Redis();
  const app = express();
  app.use(
    cors({
      credentials: true,
      origin: "http://localhost:3000",
    })
  );

  const sessionMiddleware = session({
    secret: SESSION_SECRET,
    cookie: {
      secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
      sameSite: "lax", // csrf
    },
    name: "user_id",
    store: new RedisStore({
      client: redisClient,
      disableTouch: true,
    }),
    resave: false,
    saveUninitialized: false,
  });
  app.use(sessionMiddleware);
  app.use(
    "/graphql",
    graphqlHTTP(async (req, res) => ({
      schema: await buildSchema({
        resolvers: [UserResolver, GameResolver],
      }),
      context: {
        req,
        res,
        db,
      },
      graphiql: true,
    }))
  );
  const server = http.createServer(app);
  // convert a connect middleware to a Socket.IO middleware
  const wrap = (middleware: any) => (socket: any, next: any) =>
    middleware(socket.request, {}, next);

  app.get("/", (_, res) => {
    res.send(`<h1> There are ${activeUsers.size} users online. </h1>`);
  });

  const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >(server, {
    cors: {
      origin: "http://localhost:3000",
    },
  });
  io.use(wrap(sessionMiddleware));

  // io.use((socket, next) => {
  //   const session = socket.request.session;
  //   console.log(session);
  //   if (session && session.userId > -1) {
  //     next();
  //   } else {
  //     next(new Error("unauthorized"));
  //   }
  // });

  const activeUsers = new Set();
  let usersInQueue: Number[] = [];

  io.on("connection", (socket) => {
    // const userId = socket.id;
    const userId = socket.request.session.userId;
    console.log(`user connected with id ${socket.id}`);
    activeUsers.add(userId);
    socket.on("join_queue", () => {
      if (!usersInQueue.includes(userId)) {
        usersInQueue.push(userId);
      }
      console.log(`there are ${usersInQueue.length} users in the queue`);
      let roomId: string;
      if (usersInQueue.length >= 2) {
        const activeRooms = getActiveRooms(io);
        // the idea is for this to act like a queue, idk if activeRooms is perfectly sorted based on add-time though
        if (activeRooms.length > 0) {
          roomId = activeRooms[0][0];
          socket.join(roomId);
          usersInQueue = usersInQueue.slice(2);
          io.in(roomId).emit("game_found", roomId);
        }
      } else {
        roomId = uuidv4();
        socket.join(roomId);
      }
    });
    socket.on("join_room", async (roomId: string) => {
      const room = getActiveRooms(io).filter((e) => e[0] === roomId);
      if (room.length === 0) {
        socket.emit("game_not_found", roomId);
        return;
      }
      // only join if the room doesn't exist, or if it exists and there is exactly 1 other user in the room
      // gets the last room created. in theory this should work since you can't create an existing room
      if (room.length === 1 && room[0][1].size === 1) {
        // i feel like there should be a way to do this in a single query
        const toUpdate = await db("games")
          .where("room_id", roomId)
          .orderByRaw("created_at desc")
          .first();
        if (!toUpdate) {
          console.log("record to update not found.");
          return;
        }
        const [game] = await db("games")
          .where("id", toUpdate.id)
          // .update({ p2_id: socket.request.session.userId })
          .update({ p2_id: 3 })
          .returning("*");
        socket.join(roomId);
        console.log(`joined room ${roomId} that has game ${game.id}`);
        return game;
      }
    });
    socket.on("create_room", async (roomId: string) => {
      const room = getActiveRooms(io).filter((e) => e[0] === roomId);
      if (room.length !== 0) {
        console.log(`${roomId} already exists`);
        socket.emit("create_room_fail", roomId);
        return;
      }
      socket.join(roomId);
      const [res] = await db("games")
        .insert({
          room_id: roomId,
          // p1_id: socket.request.session.userId,
          p1_id: 1,
          p2_id: 1,
        })
        .returning("*");
      console.log(`created room ${roomId} and created game ${res.id}`);
    });
    socket.on("update_game", async (newGameState, roomId, playerId) => {
      const { currentGuess, prevGuesses, currentRow, gameWon } =
        newGameState.gameState;
      const message = {
        opponentCurrentGuess: currentGuess,
        opponentPrevGuesses: prevGuesses,
        opponentCurrentRow: currentRow,
        opponentGameWon: gameWon,
      };

      const game = await db("games").where({ room_id: roomId }).first();
      // need error handling here
      if (!game) {
        console.log(
          `game with room id ${roomId} not found when trying to update game`
        );
        return;
      }
      const p1Id = game.p1_id;
      const p2Id = game.p2_id;
      if (playerId === p1Id) {
        await db("games").where({ room_id: roomId }).update({
          p1_current_guess: currentGuess,
          p1_current_row: currentRow,
          p1_game_won: gameWon,
          p1_prev_guesses: prevGuesses,
        });
      }
      if (playerId === p2Id) {
        await db("games").where({ room_id: roomId }).update({
          p2_current_guess: currentGuess,
          p2_current_row: currentRow,
          p2_game_won: gameWon,
          p2_prev_guesses: prevGuesses,
        });
      }

      socket.to(roomId).emit("on_update_game", message);
    });
    socket.on("disconnect", () => {
      activeUsers.delete(userId);
      usersInQueue = usersInQueue.filter((e) => e !== userId);
      console.log(`user disconnected with id ${socket.id}`);
    });
  });

  server.listen(8080, () => {
    console.log("Listening on port 8080");
  });
};

main();
