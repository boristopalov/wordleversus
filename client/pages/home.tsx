import React, { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

interface Props {}

const Home = (props: Props): JSX.Element => {
  const [socket, setSocket] = useState<Socket>({} as Socket);

  useEffect(() => {
    console.log("hello?");
    const socket = io(`http://localhost:8080`);
    socket.emit("join_queue_request");
    setSocket(socket);
    return () => {
      socket.close();
    };
  }, []);

  return <div>hello</div>;
};

export default Home;
