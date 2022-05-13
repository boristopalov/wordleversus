import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSocket } from "../../context/socketContext";
import styles from "./join-room.module.css";
import lightning from "./lightning.svg";
import Image from "next/image";

interface Props {
  loggedIn: boolean;
}

const JoinRoomForm = ({ loggedIn }: Props): JSX.Element => {
  const socket = useSocket();
  const [roomIdToJoin, setRoomIdToJoin] = useState("");
  const router = useRouter();

  const handleJoinRoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoomIdToJoin(e.target.value);
  };

  const joinRoom = (e: React.FormEvent<HTMLFormElement>) => {
    if (!loggedIn) {
      return;
    }
    e.preventDefault();
    socket?.emit("join_room", roomIdToJoin);
    socket?.once("game_not_found", (roomId: string) => {
      console.log(`${roomId} does not exist`);
      return;
    });
    socket?.once("game_found", (roomId: string) => {
      router.push(`/game/${roomId}`);
    });
  };

  const joinRandomRoom = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!loggedIn) {
      return;
    }
    // console.log(socket?.listeners("game_found"));
    e.preventDefault();
    // only emit join_queue event if we haven't already joined the queue
    if (socket?.listeners("game_found").length === 0) {
      console.log("joining the queue!");
      socket?.emit("join_queue");
      socket?.once("game_found", (roomId: string) => {
        console.log(`game found with id ${roomId}`);
        router.push(`/game/${roomId}`);
      });
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={joinRoom} className={styles.form}>
        <input
          placeholder="Room Name"
          value={roomIdToJoin}
          onChange={handleJoinRoomChange}
          disabled={!loggedIn}
        />
        <button type="submit" disabled={!loggedIn}>
          Join Game
        </button>
      </form>
      <hr className={styles.hr} />
      <button
        onClick={joinRandomRoom}
        className={styles.quickPlayBtn}
        disabled={!loggedIn}
      >
        <Image src={lightning} alt="Lightning" width="70%" height="40%" />
        <div>Quick Play</div>
      </button>
    </div>
  );
};

export default JoinRoomForm;
