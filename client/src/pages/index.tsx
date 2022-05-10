import React from "react";
import CreateRoomForm from "../components/create-room/CreateRoomForm";
import JoinRoomForm from "../components/join-room/JoinRoomForm";
import Nav from "../components/nav/Nav";
import styles from "../styles/Home.module.css";

const Home = (): JSX.Element => {
  return (
    <>
      <Nav />
      <div className={styles.container}>
        <JoinRoomForm />
        <CreateRoomForm />
      </div>
    </>
  );
};

export default Home;
