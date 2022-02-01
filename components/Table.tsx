import { useEffect, useState } from "react";
import EmptyRow from "./EmptyRow";
import FilledRow from "./FilledRow";
import Row from "./Row";
import { VALIDGUESSES } from "../constants/validGuesses";
import { WORDS } from "../constants/words";
import { WORDOFTHEDAY } from "../utils/getRandomWord";

const Table = (): JSX.Element => {
  const [currentGuess, setCurrentGuess] = useState<string[]>([]);
  const [prevGuesses, setPrevGuesses] = useState<string[]>([]);
  const [currentRow, setCurrentRow] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  const filledRows = Array.from(Array(currentRow));
  const emptyRows = Array.from(Array(5 - Math.min(filledRows.length, 5)));

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

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [currentGuess]);

  return (
    <div>
      {filledRows.map((_, i) => (
        <FilledRow key={i} rowValue={prevGuesses[i]} />
      ))}
      {currentRow < 6 && <Row rowValue={currentGuess.join("")} />}

      {emptyRows.map((_, i) => (
        <EmptyRow key={i} />
      ))}
    </div>
  );
};

export default Table;
