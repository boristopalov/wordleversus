import { Server } from "socket.io";
import express from "express";
import http from "http";
import cors from "cors";
import {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from "types/Sockets";
import { getActiveRooms } from "./utils/getActiveRooms";

const main = async () => {
  const app = express();
  app.use(cors());
  const server = http.createServer(app);
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
  // const usersInQueue = new Set();
  let usersInQueue: string[] = [];

  app.get("/", (_, res) => {
    res.send(`<h1> There are ${activeUsers.size} users online. </h1>`);
  });

  io.on("connection", (socket) => {
    const userId = socket.id;
    console.log(`user connected with id ${userId}`);
    activeUsers.add(userId);
    socket.on("join_queue", () => {
      if (!usersInQueue.includes(userId)) {
        usersInQueue.push(userId);
      }
      console.log(`there are ${usersInQueue.length} users in the queue`);
      if (usersInQueue.length >= 2) {
        const p1 = usersInQueue.pop();
        const p2 = usersInQueue.pop();
        if (!p1 || !p2) {
          console.log("there aren't 2 users in the queue right now!");
          return;
        }
        const roomId = p1 + p2;
        socket.join(roomId);
        console.log(`joined room ${roomId}`);
        console.log(getActiveRooms(io));
      }
    });
    socket.on("join_room", (roomId: string) => {
      socket.join(roomId);
      console.log(`joined room ${roomId}`);
      console.log(getActiveRooms(io));
    });
    socket.on("update_game", (message, roomId) => {
      socket.to(roomId).emit(message);
      console.log(`updated ${roomId}'s game state to ${message}`);
    });
    socket.on("disconnect", () => {
      activeUsers.delete(userId);
      usersInQueue = usersInQueue.filter((e) => e !== userId);
      console.log(`user disconnected with id ${userId}`);
    });

    // works when broadcast to all
    io.emit("noArg");

    // works when broadcasting to a room
    io.to("room1").emit("basicEmit", 1, "2", Buffer.from([3]));
  });

  server.listen(8080, () => {
    console.log("Listening on port 8080");
  });
};

main();
