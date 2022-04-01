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
import session from "express-session";
import { SESSION_SECRET } from "./config";
import Redis from "ioredis";

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
  app.use(
    session({
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
    })
  );
  app.use(
    "/graphql",
    graphqlHTTP(async (req, res) => ({
      schema: await buildSchema({
        resolvers: [UserResolver],
      }),
      context: {
        test: "hi",
        req,
        res,
        db,
      },
      graphiql: true,
    }))
  );
  const server = http.createServer(app);
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
  const activeUsers = new Set();
  let usersInQueue: string[] = [];

  io.on("connection", (socket) => {
    const userId = socket.id;
    console.log(`user connected with id ${userId}`);
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
    socket.on("join_room", (roomId: string) => {
      const room = getActiveRooms(io).filter((e) => e[0] === roomId);
      console.log(room);
      // only join if the room doesn't exist, or if it exists and there are less than 2 users in the room
      if (room.length === 0 || (room.length === 1 && room[0][1].size < 2)) {
        socket.join(roomId);
        console.log(`joined room ${roomId}`);
      }
    });
    socket.on("update_game", (newGameState, roomId) => {
      const { currentGuess, prevGuesses, currentRow, gameWon } =
        newGameState.gameState;
      const message = {
        opponentCurrentGuess: currentGuess,
        opponentPrevGuesses: prevGuesses,
        opponentCurrentRow: currentRow,
        opponentGameWon: gameWon,
      };
      socket.to(roomId).emit("on_update_game", message);
    });
    socket.on("disconnect", () => {
      activeUsers.delete(userId);
      usersInQueue = usersInQueue.filter((e) => e !== userId);
      console.log(`user disconnected with id ${userId}`);
    });
  });

  server.listen(8080, () => {
    console.log("Listening on port 8080");
  });
};

main();
