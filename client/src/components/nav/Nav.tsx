import React from "react";
import Link from "next/link";
import styles from "./nav.module.css";
import { gql, useQuery } from "@apollo/client";

const LOGGED_IN = gql`
  query me {
    me {
      id
      username
    }
  }
`;

interface Props {}

const Nav = (props: Props): JSX.Element => {
  const { data, loading, error } = useQuery(LOGGED_IN);
  console.log(data, loading, error);

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
        <div className={styles.navItem}>
          <Link href={`/user/${data.me.username}`}>
            <a>{data.me.username}</a>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Nav;
