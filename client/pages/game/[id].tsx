import { useEffect, useRef, useState } from "react";
import Keyboard from "../../components/keyboard/Keyboard";
import Table from "../../components/Table";
import styles from "../../styles/Home.module.css";
import { VALIDGUESSES } from "../../constants/validGuesses";
import { WORDS } from "../../constants/words";
import { WORDOFTHEDAY } from "../../utils/getRandomWord";
import {
  fetchPrevGuessesFromStorage,
  fetchCurrentRowFromStorage,
  fetchGameStateFromStorage,
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
  const roomId = router.query.id;

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
    if (!gameWon) {
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
    if (!gameWon) {
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
    setPrevGuesses(fetchPrevGuessesFromStorage);
    setCurrentRow(fetchCurrentRowFromStorage);
    setGameWon(fetchGameStateFromStorage);
  }, []);

  useEffect(() => {
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
  }, [currentRow]);

  return (
    <div className={styles.wrapper}>
      <Table
        gameState={{
          currentGuess: currentGuess,
          prevGuesses: prevGuesses,
          currentRow: currentRow,
          gameWon: gameWon,
        }}
        handleKeyPress={handleKeyPress}
      />
      <Keyboard
        gameState={{
          currentGuess: currentGuess,
          prevGuesses: prevGuesses,
          currentRow: currentRow,
          gameWon: gameWon,
        }}
        guessedAbsent={[]}
        guessedCorrect={[]}
        guessedPresent={[]}
        handleKeyBoardClick={handleKeyBoardClick}
      />
    </div>
  );
};

export default Game;
