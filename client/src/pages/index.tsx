import { gql, useQuery } from "@apollo/client";
import Link from "next/link";
import React, { useState } from "react";
import CreateRoomForm from "../components/create-room/CreateRoomForm";
import JoinRoomForm from "../components/join-room/JoinRoomForm";
import Nav from "../components/nav/Nav";
import styles from "../styles/Home.module.css";

const LOGGED_IN = gql`
  query me {
    me {
      id
      username
    }
  }
`;

const Home = (): JSX.Element => {
  const [loggedIn, setLoggedIn] = useState(false);
  const { data, loading, error } = useQuery(LOGGED_IN, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-only",
    onCompleted: (data) => {
      setLoggedIn(() => {
        if (data.me) return true;
        return false;
      });
    },
  });

  if (loading) {
    return <div className={styles.container}>loading</div>;
  }

  if (error) {
    return <div className={styles.container}>error</div>;
  }

  return (
    <>
      <Nav />
      {!loggedIn && (
        <h3 className={styles.center}>
          Please
          <Link href="/login">
            <a className={styles.link}> log in </a>
          </Link>
          or
          <Link href="/login">
            <a className={styles.link}> register </a>
          </Link>
          to play.
        </h3>
      )}
      <div className={styles.container}>
        <JoinRoomForm loggedIn={loggedIn} />
        <CreateRoomForm loggedIn={loggedIn} />
      </div>
    </>
  );
};

export default Home;
