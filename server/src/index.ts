import "reflect-metadata";
import { Server } from "socket.io";
import express, { NextFunction, Request, Response } from "express";
import http from "http";
import cors from "cors";
import {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from "./types/socketEvents";
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
import { getRandomSolution } from "./utils/getRandomSolutions";

declare module "http" {
  interface IncomingMessage {
    session: Session & {
      userId: number;
    };
  }
}

const main = async () => {
  const RedisStore = require("connect-redis")(session);
  const redisClient: Redis = new Redis({ host: "localhost", port: 6379 });
  const app = express();

  const sessionMiddleware = session({
    secret: SESSION_SECRET,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: false,
      sameSite: "lax", // csrf
    },
    proxy: true,
    name: "qid",
    store: new RedisStore({
      client: redisClient,
      disableTouch: true,
    }),
    resave: false,
    saveUninitialized: false,
  });
  app.use(sessionMiddleware);
  app.use(
    cors({
      credentials: true,
      origin: "http://localhost:3000",
    })
  );
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

  app.get("/", (_, res) => {
    // req.session.userId = 5;
    // console.log("express session", req.session);
    res.send(`<h1> There are ${activeUsers.size} users online. </h1>`);
  });

  app.get("/test", (_, res) => {
    // req.session.userId = 5;
    // console.log("express session", req.session);
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
      credentials: true,
    },
    // cookie: {
    //   name: "io",
    //   path: "/",
    //   httpOnly: false,
    //   sameSite: "lax",
    // },
  });
  // connect to express session
  io.use((socket, next) => {
    sessionMiddleware(
      socket.request as Request,
      {} as Response,
      next as NextFunction
    );
  });

  // io.use((socket, next) => {
  //   socket.request.session.reload((err) => {
  //     if (err) {
  //       console.log(err);
  //       console.log("no session detected - user is not logged in!");
  //       socket.disconnect();
  //     } else {
  //       next();
  //     }
  //   });
  // });

  const activeUsers = new Set();
  let usersInQueue: Number[] = [];

  io.on("connection", (socket) => {
    const req = socket.request;
    console.log("socket session id", req.session.id);
    console.log(`user connected with id ${socket.id}`);
    activeUsers.add(socket.id);
    socket.on("join_queue", async () => {
      console.log(req.session);
      console.log(usersInQueue);
      if (!req.session.userId) {
        return;
      }
      if (!usersInQueue.includes(req.session.userId)) {
        usersInQueue.push(req.session.userId);
      }
      console.log(`there are ${usersInQueue.length} users in the queue`);
      let roomId: string;
      if (usersInQueue.length >= 2) {
        const activeRooms = getActiveRooms(io);
        console.log(activeRooms);
        // the idea is for this to act like a queue, idk if activeRooms is perfectly sorted based on add-time though
        if (activeRooms.length > 0) {
          let c = 0;
          let roomId;
          while (true) {
            if (activeRooms[c][1].size < 2) {
              roomId = activeRooms[c][0];
              break;
            }
            c++;
          }
          // roomId = activeRooms[0][0];
          const toUpdate = await db("games")
            .where("room_id", roomId)
            .orderByRaw("created_at desc")
            .first();
          if (!toUpdate) {
            console.log("record to update not found.");
            return;
          }
          await db("games")
            .where("id", toUpdate.id)
            .update({ p2_id: req.session.userId })
            .returning("*");
          socket.join(roomId);
          usersInQueue = usersInQueue.slice(2);
          io.in(roomId).emit("game_found", roomId);
        }
      } else {
        roomId = uuidv4();
        socket.join(roomId);
        const solution = getRandomSolution();
        const [res] = await db("games")
          .insert({
            room_id: roomId,
            p1_id: req.session.userId,
            p2_id: req.session.userId,
            solution: solution,
          })
          .returning("*");
        console.log(`created room ${roomId} and created game ${res.id}`);
      }
    });
    socket.on("join_room", async (roomId) => {
      if (!req.session.userId) {
        console.log("user not logged in from server!");
        return;
      }
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
          .update({ p2_id: req.session.userId })
          .returning("*");
        socket.join(roomId);
        console.log(`joined room ${roomId} that has game ${game.id}`);
        socket.emit("game_found", roomId);
        return game;
      }
    });
    socket.on("create_room", async (roomId) => {
      if (!req.session.userId) {
        console.log("from socket- no user logged in");
        return;
      }
      const room = getActiveRooms(io).filter((e) => e[0] === roomId);
      if (room.length !== 0) {
        console.log(`${roomId} already exists`);
        socket.emit("create_room_fail", roomId);
        return;
      }
      socket.join(roomId);
      const solution = getRandomSolution();
      const [res] = await db("games")
        .insert({
          room_id: roomId,
          p1_id: req.session.userId,
          p2_id: req.session.userId,
          solution: solution,
        })
        .returning("*");
      console.log(`created room ${roomId} and created game ${res.id}`);
      socket.emit("create_room_success", roomId);
    });
    socket.on("load_game_from_room", async (roomId) => {
      // console.log(req.session);
      const game = await db("games")
        .where("room_id", roomId)
        .orderByRaw("created_at desc")
        .first();
      if (!game) {
        console.log("game not found");
        return;
      }
      const playerId = req.session.userId;
      if (playerId !== game.p1_id && playerId !== game.p2_id) {
        console.log("Neither client is playing in this game");
        return;
      }
      // if the socket hasn't joined the room, join it here (this happens if the page gets refreshed)
      if (!socket.rooms.has(roomId)) {
        socket.join(roomId);
      }
      let ret;
      if (playerId === game.p1_id) {
        ret = {
          id: game.id,
          playerId: game.p1_id,
          opponentId: game.p2_id,
          prevGuesses: game.p1_prev_guesses,
          currentRow: game.p1_current_row,
          currentGuess: game.p1_current_guess,
          gameWon: game.p1_game_won,
          opponentPrevGuesses: game.p2_prev_guesses,
          opponentCurrentRow: game.p2_current_row,
          opponentCurrentGuess: game.p2_current_guess,
          opponentGameWon: game.p2_game_won,
          ready: game.p1_ready,
          opponentReady: game.p2_ready,
          solution: game.solution,
          active: game.active,
        };
        socket.emit("on_load_game_from_room", ret);
      } else if (playerId === game.p2_id) {
        ret = {
          id: game.id,
          playerId: game.p2_id,
          opponentId: game.p1_id,
          prevGuesses: game.p2_prev_guesses,
          currentRow: game.p2_current_row,
          currentGuess: game.p2_current_guess,
          gameWon: game.p2_game_won,
          opponentPrevGuesses: game.p1_prev_guesses,
          opponentCurrentRow: game.p1_current_row,
          opponentCurrentGuess: game.p1_current_guess,
          opponentGameWon: game.p1_game_won,
          opponentReady: game.p1_ready,
          ready: game.p2_ready,
          solution: game.solution,
          active: game.active,
        };
        socket.emit("on_load_game_from_room", ret);
      }
    });

    socket.on("ready_toggle", async (ready, roomId) => {
      const game = await db("games").where({ room_id: roomId }).first();
      if (!game) {
        console.log(
          `game with room id ${roomId} not found when trying to update game`
        );
        return;
      }
      if (req.session.userId === game.p1_id) {
        await db("games").where({ id: game.id }).update({
          p1_ready: ready,
        });
      } else if (req.session.userId === game.p2_id) {
        await db("games").where({ id: game.id }).update({
          p2_ready: ready,
        });
      }
      socket.to(roomId).emit("on_opponent_ready_toggle", ready);
    });
    socket.on("activate_game", async (roomId) => {
      const game = await db("games").where({ room_id: roomId }).first();
      if (!game) {
        console.log(
          `game with room id ${roomId} not found when trying to update game`
        );
        return;
      }
      await db("games").where({ id: game.id }).update({
        active: true,
      });
      socket.to(roomId).emit("on_activate_game");
    });
    socket.on("update_game", async (newGameState, roomId) => {
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
      const playerId = req.session.userId;
      if (playerId === game.p1_id) {
        await db("games").where({ id: game.id }).update({
          p1_current_guess: currentGuess,
          p1_current_row: currentRow,
          p1_game_won: gameWon,
          p1_prev_guesses: prevGuesses,
        });
      }
      if (playerId === game.p2_id) {
        await db("games").where({ id: game.id }).update({
          p2_current_guess: currentGuess,
          p2_current_row: currentRow,
          p2_game_won: gameWon,
          p2_prev_guesses: prevGuesses,
        });
      }
      // this emits to everyone but the sender of the update_game request (so the other player)
      socket.to(roomId).emit("on_update_game", message);
    });
    socket.on("disconnect", () => {
      activeUsers.delete(socket.id);
      usersInQueue = usersInQueue.filter((e) => e !== req.session.userId);
      console.log(`user disconnected with id ${socket.id}`);
    });
  });

  server.listen(8080, () => {
    console.log("Listening on port 8080");
  });
};

main();
