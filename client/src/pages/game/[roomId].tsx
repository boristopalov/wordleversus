import React, { useEffect, useState } from "react";
import Keyboard from "../../components/keyboard/Keyboard";
import Table from "../../components/player/Table";
import OpponentTable from "../../components/opponent/OpponentTable";
import GameState from "../../types/OpponentGameState";
import styles from "../../styles/Game.module.css";
import { VALIDGUESSES } from "../../constants/validGuesses";
import { WORDS } from "../../constants/words";
import { useRouter } from "next/router";
import { useSocket } from "../../context/socketContext";
import Nav from "../../components/nav/Nav";

const Game = (): JSX.Element => {
  const [currentGuess, setCurrentGuess] = useState<string[]>([]);
  const [prevGuesses, setPrevGuesses] = useState<string[]>([]);
  const [currentRow, setCurrentRow] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [solution, setSolution] = useState("");
  const [ready, setReady] = useState(false);
  const [opponentReady, setOpponentReady] = useState(false);
  const router = useRouter();
  const socket = useSocket();
  const [opponentPrevGuesses, setOpponentPrevGuesses] = useState<string[]>([]);
  const [opponentCurrentRow, setOpponentCurrentRow] = useState(0);
  const [opponentGameWon, setOpponentGameWon] = useState(false);
  const [countdownTimeLeft, setCountdownTimeLeft] = useState(0);
  const [active, setActive] = useState(false);

  const roomId =
    typeof router.query.roomId === "string" ? router.query.roomId : null;

  const handleEnter = () => {
    const guessString = currentGuess.join("").toLowerCase();
    if (guessString === solution.toLowerCase()) {
      setGameWon(true);
    }

    if (
      currentGuess.length === 5 &&
      currentRow < 6 &&
      (VALIDGUESSES.includes(guessString) || WORDS.includes(guessString))
    ) {
      setCurrentGuess([]);
      setPrevGuesses((prevGuesses) => {
        const newGuesses = [...prevGuesses, guessString];
        return newGuesses;
      });
      setCurrentRow((currentRow) => {
        const nextRow = currentRow + 1;
        return nextRow;
      });
    }
  };

  const handleBackspace = () => {
    setCurrentGuess((prevGuess) => {
      const newGuess = prevGuess.slice(0, prevGuess.length - 1);
      return newGuess;
    });
  };

  const handleLetter = (key: string) => {
    setCurrentGuess((prevGuess) => {
      if (prevGuess.length < 5) {
        const newGuess = [...prevGuess, key];
        return newGuess;
      }
      return prevGuess;
    });
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    const key = e.key.toUpperCase();
    if (!gameWon && !opponentGameWon && active) {
      if (key === "ENTER") {
        handleEnter();
      }
      if (key === "BACKSPACE") {
        handleBackspace();
      }
      if (key.length == 1 && key >= "A" && key <= "Z") {
        handleLetter(key);
      }
    }
  };

  const handleKeyBoardClick = (e: React.MouseEvent<HTMLElement>) => {
    const key = e.currentTarget.getAttribute("data-key");
    if (!gameWon && !opponentGameWon && active) {
      if (key === "ENTER") {
        handleEnter();
      }
      if (key === "BACKSPACE") {
        handleBackspace();
      }
      if (key?.length == 1 && key >= "A" && key <= "Z") {
        handleLetter(key);
      }
    }
  };

  const toggleReady = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const target = e.target as HTMLButtonElement;
    setReady((ready) => {
      socket?.emit("ready_toggle", !ready, roomId!);
      if (!ready) {
        target.classList.add(styles.playerIsReady);
        return true;
      }
      target.classList.remove(styles.playerIsReady);
      return false;
    });
  };

  useEffect(() => {
    if (!roomId) {
      console.log("no room id- this shouldnt happen");
      return;
    }
    socket?.emit("load_game_from_room", roomId);
    socket?.once("on_load_game_from_room", (game) => {
      const {
        id,
        playerId,
        opponentId,
        prevGuesses,
        currentGuess,
        currentRow,
        gameWon,
        opponentCurrentGuess,
        opponentCurrentRow,
        opponentGameWon,
        opponentPrevGuesses,
        solution,
        ready,
        opponentReady,
        active,
      } = game;

      if (!active) {
        setCountdownTimeLeft(5);
      }

      setPrevGuesses(prevGuesses);
      setCurrentRow(currentRow);
      setGameWon(gameWon);
      setSolution(solution);
      setOpponentPrevGuesses(opponentPrevGuesses);
      setOpponentCurrentRow(opponentCurrentRow);
      setOpponentGameWon(opponentGameWon);
      setReady(ready);
      setOpponentReady(opponentReady);
      setActive(active);
    });
  }, [roomId, socket]);

  useEffect(() => {
    const updateOpponentGameState = ({
      opponentCurrentRow,
      opponentPrevGuesses,
      opponentGameWon,
    }: GameState) => {
      setOpponentCurrentRow(opponentCurrentRow);
      setOpponentPrevGuesses(opponentPrevGuesses);
      setOpponentGameWon(opponentGameWon);
    };

    const toggleOpponentReady = (ready: boolean) => {
      setOpponentReady(ready);
    };

    socket?.on("on_update_game", updateOpponentGameState);
    socket?.on("on_opponent_ready_toggle", toggleOpponentReady);
    socket?.on("on_activate_game", () => setActive(true));

    return () => {
      socket?.off("on_update_game", updateOpponentGameState);
    };
  }, [socket]);

  useEffect(() => {
    if (!roomId) {
      console.log("room id is null but should not be");
      return;
    }
    socket?.emit(
      "update_game",
      {
        gameState: {
          currentGuess: currentGuess,
          prevGuesses: prevGuesses,
          currentRow: currentRow,
          gameWon: gameWon,
        },
      },
      roomId
    );
  }, [currentGuess, currentRow, gameWon, prevGuesses, roomId, socket]);

  useEffect(() => {
    if (ready && opponentReady && !active) {
      let timer: NodeJS.Timer;
      if (countdownTimeLeft > 0) {
        timer = setInterval(() => {
          setCountdownTimeLeft((countdownTimeLeft) => countdownTimeLeft - 1);
        }, 1000);
      }
      if (countdownTimeLeft === 0) {
        setActive(true);
        socket?.emit("activate_game", roomId!);
      }

      return () => clearInterval(timer);
    }
  }, [active, countdownTimeLeft, opponentReady, ready, roomId, socket]);

  const readyButtons = (
    <div className={styles.readyButtons}>
      <button
        className={ready ? styles.ready : styles.notReady}
        onClick={toggleReady}
      >
        {ready ? "Click to unready" : "Click to ready"}
      </button>
      <div
        className={
          opponentReady ? styles.opponentReady : styles.opponentNotReady
        }
      >
        {opponentReady ? "Opponent Ready" : "Waiting for opponent..."}
      </div>
    </div>
  );
  const timer = <div className={styles.timer}>{countdownTimeLeft}</div>;

  return (
    <>
      <Nav />
      <div className={styles.wrapper}>
        <div className={styles.tableWrapper}>
          <div>
            <Table
              gameState={{
                currentGuess: currentGuess,
                prevGuesses: prevGuesses,
                currentRow: currentRow,
                gameWon: gameWon,
              }}
              handleKeyPress={handleKeyPress}
              solution={solution}
            />
          </div>
          {(!ready || !opponentReady) && !active && readyButtons}
          {ready && opponentReady && !active && timer}

          <div>
            <OpponentTable
              gameState={{
                prevGuesses: opponentPrevGuesses,
                currentRow: opponentCurrentRow,
                gameWon: opponentGameWon,
              }}
              handleKeyPress={handleKeyPress}
              solution={solution}
            />
          </div>
        </div>
        <Keyboard
          solution={solution}
          prevGuesses={prevGuesses}
          handleKeyBoardClick={handleKeyBoardClick}
        />
      </div>
    </>
  );
};

// adding this in fixes an issue where refreshing the page doesn't get the room id from the URL in router.query.params
// https://stackoverflow.com/questions/61891845/is-there-a-way-to-keep-router-query-on-page-refresh-in-nextjs
export async function getServerSideProps() {
  return {
    props: {}, // will be passed to the page component as props
  };
}

export default Game;
