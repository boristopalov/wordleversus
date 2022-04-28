import { useRouter } from "next/router";
import React, { useState } from "react";
import { useSocket } from "../context/socketContext";
import { gql, useQuery } from "@apollo/client";

const GET_GAME = gql`
  query getGame($id: Float!) {
    getGame(id: $id) {
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
  const [roomId, setRoomId] = useState("");
  const router = useRouter();

  const handleRoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoomId(e.target.value);
  };

  const joinRoom = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socket?.emit("join_room", roomId);
    router.push(`/game/${roomId}`);
  };

  const joinRandomRoom = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // only emit join_queue event if we haven't already joined the queue
    if (socket?.listeners("game_found").length === 0) {
      console.log("joining the queue!");
      socket?.emit("join_queue");
      socket?.once("game_found", (roomId) => {
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
            value={roomId}
            onChange={handleRoomChange}
          />
          <button type="submit"> Join Room </button>
        </form>
      </div>
      <div>
        <button onClick={joinRandomRoom}>Quick Play</button>
      </div>
    </>
  );
};

export default Home;
