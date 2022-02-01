import type { NextPage } from "next";
import { useState } from "react";
import Keyboard from "../components/keyboard/Keyboard";
import Table from "../components/Table";
import styles from "../styles/Home.module.css";
import { VALIDGUESSES } from "../constants/validGuesses";
import { WORDS } from "../constants/words";
import { WORDOFTHEDAY } from "../utils/getRandomWord";

const App: NextPage = (): JSX.Element => {
  const [currentGuess, setCurrentGuess] = useState<string[]>([]);
  const [prevGuesses, setPrevGuesses] = useState<string[]>([]);
  const [currentRow, setCurrentRow] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  const handleEnter = () => {
    const guessString = currentGuess.join("").toLowerCase();
    if (guessString === "hells") {
      setGameWon(true);
    }

    if (
      currentGuess.length === 5 &&
      currentRow < 6 &&
      (VALIDGUESSES.includes(guessString) || WORDS.includes(guessString))
    ) {
      setCurrentGuess([]);
      // window.localStorage.setItem("currentGuess", JSON.stringify([]));
      setPrevGuesses((prevGuesses) => [...prevGuesses, guessString]);
      // window.localStorage.setItem("prevGuesses", JSON.stringify(prevGuesses));
      setCurrentRow((currentRow) => currentRow + 1);
      // window.localStorage.setItem("currentRow", JSON.stringify(currentRow));
    }
  };

  const handleBackspace = () => {
    setCurrentGuess((prevGuess) => prevGuess.slice(0, prevGuess.length - 1));
    // window.localStorage.setItem("currentGuess", JSON.stringify(currentGuess));
  };

  const handleLetter = (key: string) => {
    if (currentGuess.length < 5) {
      setCurrentGuess((prevGuess) => [...prevGuess, key]);
      // window.localStorage.setItem("currentGuess", JSON.stringify(currentGuess));
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

export default App;
