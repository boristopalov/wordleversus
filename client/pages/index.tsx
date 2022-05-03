import { useRouter } from "next/router";
import React, { useState } from "react";
import { useSocket } from "../context/socketContext";
import { gql, useMutation } from "@apollo/client";

const CREATE_GAME = gql`
  mutation createGame($roomId: String!, $p1Id: Float!, $p2Id: Float!) {
    createGame(roomId: $roomId, p1Id: $p1Id, p2Id: $p2Id) {
      errors {
        message
      }
      game {
        id
        roomId
        p1PrevGuesses
      }
    }
  }
`;

const Home = (): JSX.Element => {
  const socket = useSocket();
  const [roomIdToJoin, setRoomIdToJoin] = useState("");
  const [roomIdToCreate, setRoomIdToCreate] = useState("");
  const router = useRouter();

  const handleJoinRoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoomIdToJoin(e.target.value);
  };

  const joinRoom = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // console.log(roomId);
    socket?.emit("join_room", roomIdToJoin);
    socket?.once("game_not_found", (roomId: string) => {
      console.log(`${roomId} does not exist`);
    });
    // router.push(`/game/${roomIdToJoin}`);
  };

  const handleCreateRoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoomIdToCreate(e.target.value);
  };

  const createRoom = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // console.log(roomId);
    socket?.emit("create_room", roomIdToCreate);
    socket?.once("create_room_fail", (roomId: string) => {
      console.log(`${roomId} already exists`);
    });
    // router.push(`/game/${roomIdToCreate}`);
  };

  const joinRandomRoom = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // only emit join_queue event if we haven't already joined the queue
    if (socket?.listeners("game_found").length === 0) {
      console.log("joining the queue!");
      socket?.emit("join_queue");
      socket?.once("game_found", (roomId: string) => {
        console.log(`game found with id ${roomId}`);
        router.push(`/game/${roomId}`);
      });
    }
  };

  return (
    <>
      <div>
        <form onSubmit={joinRoom}>
          <input
            placeholder="Room ID"
            value={roomIdToJoin}
            onChange={handleJoinRoomChange}
          />
          <button type="submit"> Join Room </button>
        </form>
      </div>
      <div>
        <form onSubmit={createRoom}>
          <input
            placeholder="Room ID"
            value={roomIdToCreate}
            onChange={handleCreateRoomChange}
          />
          <button type="submit"> Create Room </button>
        </form>
      </div>
      <div>
        <button onClick={joinRandomRoom}>Quick Play</button>
      </div>
    </>
  );
};

export default Home;
