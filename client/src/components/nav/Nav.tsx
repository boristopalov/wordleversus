import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./nav.module.css";
import { gql, useQuery, useMutation } from "@apollo/client";
import { useApolloClient } from "@apollo/client";
import { useRouter } from "next/router";
import { isServer } from "../../utils/utils";

const LOGGED_IN = gql`
  query me {
    me {
      id
      username
    }
  }
`;

const LOGOUT_USER = gql`
  mutation logoutUser {
    logoutUser
  }
`;

interface Props {}

const Nav = (props: Props): JSX.Element => {
  const { data, loading, error } = useQuery(LOGGED_IN, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-first",
    // skip: !isServer(),
  });
  const apolloClient = useApolloClient();
  const router = useRouter();
  // const [queryLoading, setQueryLoading] = useState(false);
  const [
    logoutUser,
    { data: logoutRes, loading: logoutLoading, error: logoutError },
  ] = useMutation(LOGOUT_USER);

  console.log("hey");
  console.log(data);
  console.log(loading);

  const handleLogout = async () => {
    const res = await logoutUser();
    if (!res) {
      console.log("error logging out");
      return;
    }
    await apolloClient.resetStore();
    router.push("/");
  };

  if (loading) {
    return <div className={styles.container}>loading</div>;
  }

  if (error) {
    return <div className={styles.container}>error</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.navItem}>
          <Link href="/">
            <a>Play</a>
          </Link>
        </div>
        {!data.me && (
          <>
            <div className={styles.navItem}>
              <Link href="/login">
                <a>Login</a>
              </Link>
            </div>
            <div className={styles.navItem}>
              <Link href="/register">
                <a>Register</a>
              </Link>
            </div>
          </>
        )}
      </div>
      {data.me && (
        <div className={styles.right}>
          <div className={styles.navItem}>
            <Link href={`/user/${data.me.username}`}>
              <a>{data.me.username}</a>
            </Link>
          </div>
          <div className={styles.navItem}>
            <button className={styles.logoutBtn} onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Nav;
