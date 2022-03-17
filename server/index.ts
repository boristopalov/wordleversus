import { Server } from "socket.io";
import express from "express";
import http from "http";
import cors from "cors";
import Queue from "./types/Queue";

interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  join_queue: () => void;
}

interface ClientToServerEvents {
  hello: () => void;
  join_queue_request: (id: string) => void;
}

interface InterServerEvents {
  ping: () => void;
}

interface SocketData {
  name: string;
  age: number;
}

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
  let usersInQueue = new Queue();
  app.get("/", (_, res) => {
    res.send(`<h1> There are ${activeUsers.size} users online. </h1>`);
  });

  io.on("connection", (socket) => {
    const userId = socket.id;
    console.log(`user connected with id ${userId}`);
    activeUsers.add(userId);
    // socket.emit("noArg");
    // socket.emit("basicEmit", 1, "2", Buffer.from([3]));
    socket.on("join_queue_request", () => {
      usersInQueue.enqueue(userId);
    });
    socket.emit("withAck", "4", (_) => {});

    socket.on("disconnect", () => {
      activeUsers.delete(userId);
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
