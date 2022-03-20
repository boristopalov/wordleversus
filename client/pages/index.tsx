import React, { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

interface Props {}

const Home = (props: Props): JSX.Element => {
  const [socket, setSocket] = useState<Socket>({} as Socket);
  const [roomId, setRoomId] = useState("");

  const handleRoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoomId(e.target.value);
  };

  const joinRoom = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socket.emit("join_room", roomId);
  };

  const joinRandomRoom = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    socket.emit("join_queue");
  };
  useEffect(() => {
    console.log("hello?");
    const socket = io(`http://localhost:8080`);
    socket.on("connect", () => {
      setSocket(socket);
    });
    return () => {
      socket.close();
    };
  }, []);

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
