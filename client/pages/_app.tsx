import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SocketContextProvider } from "../context/socketContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SocketContextProvider>
      <Component {...pageProps} />
    </SocketContextProvider>
  );
}

export default MyApp;
