import { gql, useQuery } from "@apollo/client";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
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
  const router = useRouter();
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

  // express session and socket session are only being shared if i refresh the page. no idea why
  // socket session data doesn't get updated until the page gets refreshed
  useEffect(() => {
    if (router.query.from) {
      window.location.reload();
    }
  }, []);

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
          <Link href="/register">
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
