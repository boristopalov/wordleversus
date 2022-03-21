// https://devtrium.com/posts/how-use-react-context-pro
import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
const SocketContext = createContext<Socket | undefined>(undefined);

const useSocket = () => {
  const context = useContext(SocketContext);
  console.log(context);
  // if (context === undefined) {
  //   throw new Error("useSocket was used outside of its provider");
  // }
  return context;
};

const SocketContextProvider: React.FC = ({ children }) => {
  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    const socket = io(`http://localhost:8080`);
    socket.on("connect", () => {
      setSocket(socket);
    });
    return () => {
      socket.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export { SocketContext, SocketContextProvider, useSocket };
