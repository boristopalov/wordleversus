import { useEffect, useState } from "react";
import Keyboard from "../../components/keyboard/Keyboard";
import Table from "../../components/player/Table";
import OpponentTable from "../../components/opponent/OpponentTable";
import GameState from "../../types/OpponentGameState";
import styles from "../../styles/Game.module.css";
import { VALIDGUESSES } from "../../constants/validGuesses";
import { WORDS } from "../../constants/words";
import { WORDOFTHEDAY } from "../../utils/getRandomWord";
import {
  fetchPrevGuessesFromStorage,
  fetchCurrentRowFromStorage,
  fetchGameWonFromStorage,
  fetchOpponentPrevGuessesFromStorage,
  fetchOpponentCurrentRowFromStorage,
  fetchOpponentGameWonFromStorage,
} from "../../utils/fetchFromStorage";
import { useRouter } from "next/router";
import { useSocket } from "../../context/socketContext";

const Game = (): JSX.Element => {
  const [currentGuess, setCurrentGuess] = useState<string[]>([]);
  const [prevGuesses, setPrevGuesses] = useState<string[]>([]);
  const [currentRow, setCurrentRow] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const router = useRouter();
  const socket = useSocket();
  const [opponentCurrentGuess, setOpponentCurrentGuess] = useState<string[]>(
    []
  );
  const [opponentPrevGuesses, setOpponentPrevGuesses] = useState<string[]>([]);
  const [opponentCurrentRow, setOpponentCurrentRow] = useState(0);
  const [opponentGameWon, setOpponentGameWon] = useState(false);
  const [gameId, setGameId] = useState(-1);

  const roomId =
    typeof router.query.roomId === "string" ? router.query.roomId : null;

  const handleEnter = () => {
    const guessString = currentGuess.join("").toLowerCase();
    if (guessString === "hells") {
      setGameWon(() => {
        localStorage.setItem("gameWon", "true");
        return true;
      });
    }

    if (
      currentGuess.length === 5 &&
      currentRow < 6 &&
      (VALIDGUESSES.includes(guessString) || WORDS.includes(guessString))
    ) {
      setCurrentGuess(() => {
        localStorage.setItem("currentGuess", JSON.stringify([]));
        return [];
      });
      setPrevGuesses((prevGuesses) => {
        const newGuesses = [...prevGuesses, guessString];
        localStorage.setItem("prevGuesses", JSON.stringify(newGuesses));
        return newGuesses;
      });
      setCurrentRow((currentRow) => {
        const nextRow = currentRow + 1;
        localStorage.setItem("currentRow", JSON.stringify(nextRow));
        return nextRow;
      });
    }
  };

  const handleBackspace = () => {
    setCurrentGuess((prevGuess) => {
      const newGuess = prevGuess.slice(0, prevGuess.length - 1);
      localStorage.setItem("currentGuess", JSON.stringify(newGuess));
      return newGuess;
    });
  };

  const handleLetter = (key: string) => {
    if (currentGuess.length < 5) {
      setCurrentGuess((prevGuess) => {
        const newGuess = [...prevGuess, key];
        localStorage.setItem("currentGuess", JSON.stringify(newGuess));
        return newGuess;
      });
    }
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    const key = e.key.toUpperCase();
    if (!gameWon && !opponentGameWon) {
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
    if (!gameWon && !opponentGameWon) {
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
      } = game;

      setPrevGuesses(prevGuesses);
      // setCurrentGuess(currentGuess);
      setCurrentRow(currentRow);
      setGameWon(gameWon);
      setOpponentPrevGuesses(opponentPrevGuesses);
      // setOpponentCurrentGuess(opponentCurrentGuess);
      setOpponentCurrentRow(opponentCurrentRow);
      setOpponentGameWon(opponentGameWon);
      setGameId(id);
    });
  }, [roomId, socket]);

  useEffect(() => {
    const updateOpponentGameState = ({
      opponentCurrentGuess,
      opponentCurrentRow,
      opponentPrevGuesses,
      opponentGameWon,
    }: GameState) => {
      setOpponentCurrentGuess(opponentCurrentGuess);
      setOpponentCurrentRow(opponentCurrentRow);
      setOpponentPrevGuesses(opponentPrevGuesses);
      setOpponentGameWon(opponentGameWon);
      localStorage.setItem(
        "opponentCurrentGuess",
        JSON.stringify(opponentCurrentGuess)
      );
      localStorage.setItem(
        "opponentCurrentRow",
        JSON.stringify(opponentCurrentRow)
      );
      localStorage.setItem(
        "opponentPrevGuesses",
        JSON.stringify(opponentPrevGuesses)
      );
      localStorage.setItem("opponentGameWon", JSON.stringify(opponentGameWon));
    };
    socket?.on("on_update_game", updateOpponentGameState);

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

  return (
    <div className={styles.wrapper}>
      <div className={styles.tableWrapper}>
        <Table
          gameState={{
            currentGuess: currentGuess,
            prevGuesses: prevGuesses,
            currentRow: currentRow,
            gameWon: gameWon,
          }}
          handleKeyPress={handleKeyPress}
        />
        <OpponentTable
          gameState={{
            prevGuesses: opponentPrevGuesses,
            currentRow: opponentCurrentRow,
            gameWon: opponentGameWon,
          }}
          handleKeyPress={handleKeyPress}
        />
      </div>
      <Keyboard
        solution="hells"
        prevGuesses={prevGuesses}
        handleKeyBoardClick={handleKeyBoardClick}
      />
    </div>
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
