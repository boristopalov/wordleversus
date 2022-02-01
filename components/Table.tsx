import { useEffect, useState } from "react";
import EmptyRow from "./EmptyRow";
import FilledRow from "./FilledRow";
import Row from "./Row";
import { VALIDGUESSES } from "../constants/validGuesses";

const Table = (): JSX.Element => {
  // idx of current row
  // const [currentRow, setCurrentRow] = useState(0);
  const [currentGuess, setCurrentGuess] = useState<string[]>([]);
  const [prevGuesses, setPrevGuesses] = useState<string[]>([]);
  const [currentRow, setCurrentRow] = useState(0);
  const filledRows = Array.from(Array(currentRow));
  const emptyRows = Array.from(Array(5 - filledRows.length));

  const handleEnter = () => {
    const guessString = currentGuess.join("").toLowerCase();
    if (currentGuess.length === 5 && VALIDGUESSES.includes(guessString)) {
      setCurrentRow((currentRow) => currentRow + 1);
      setPrevGuesses((prevGuesses) => [...prevGuesses, guessString]);
      setCurrentGuess([]);
    }
  };

  const handleBackspace = () => {
    setCurrentGuess((prevGuess) => {
      return prevGuess.slice(0, prevGuess.length - 1);
    });
  };

  const handleLetter = (key: string) => {
    if (currentGuess.length < 5) {
      setCurrentGuess((prevGuess) => {
        return [...prevGuess, key];
      });
    }
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    const key = e.key.toUpperCase();
    if (key === "ENTER") {
      handleEnter();
    }
    if (key === "BACKSPACE") {
      handleBackspace();
    }
    if (key.length == 1 && key >= "A" && key <= "Z") {
      handleLetter(key);
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
      <Row rowValue={currentGuess.join("")} />
      {emptyRows.map((_, i) => (
        <EmptyRow key={i} />
      ))}
    </div>
  );
};

export default Table;
