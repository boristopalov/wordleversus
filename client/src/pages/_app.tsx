import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SocketContextProvider } from "../context/socketContext";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

const cache = new InMemoryCache();
export const client = new ApolloClient({
  // Provide required constructor fields
  cache: cache,
  uri: "http://localhost:8080/graphql",

  // Provide some optional constructor fields
  queryDeduplication: false,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
      errorPolicy: "all",
    },
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <SocketContextProvider>
        <Component {...pageProps} />
      </SocketContextProvider>
    </ApolloProvider>
  );
}

export default MyApp;
