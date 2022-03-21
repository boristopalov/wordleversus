import { useRouter } from "next/router";
import React, { useState } from "react";
import { useSocket } from "../context/socketContext";

interface Props {}

const Home = (props: Props): JSX.Element => {
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
    socket?.emit("join_queue");
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
