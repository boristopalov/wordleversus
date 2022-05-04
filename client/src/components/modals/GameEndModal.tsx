import React, { useEffect, useState } from "react";
import styles from "../../styles/Modal.module.css";
import { useSocket } from "../../context/socketContext";
import { useRouter } from "next/router";

interface Props {
  gameWon: boolean;
  roomId: string | null;
}

const GameEndModal = ({ gameWon, roomId }: Props): JSX.Element => {
  const socket = useSocket();
  const router = useRouter();
  const [rematchButtonDisabled, setRematchButtonDisabled] = useState(false);

  const handleRematch = () => {
    if (!roomId) {
      throw new Error("invalid room id!");
    }
    socket?.emit("rematch_request");
  };

  useEffect(() => {
    socket?.once("rematch_response", (message) => {
      if (message) {
        // rematch has been accepted; reset the game state
      } else {
        setRematchButtonDisabled(true);
        // rematch has not been accepted. notify the user
      }
    });
  }, []);

  const text = gameWon ? "You won!" : "You lost!";
  return (
    <div className={styles.modalWrapper}>
      {text}
      <div className={styles.buttonsWrapper}>
        <button onClick={handleRematch} disabled={rematchButtonDisabled}>
          Request Rematch
        </button>
        <button>Return to Menu</button>
        {rematchButtonDisabled && <span>Rematch was not accepted.</span>}
      </div>
    </div>
  );
};

export default GameEndModal;
