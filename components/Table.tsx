import { useEffect, useState } from "react";
import EmptyRow from "./EmptyRow";
import FilledRow from "./FilledRow";
import Row from "./Row";
import { VALIDGUESSES } from "../constants/validGuesses";
import { WORDS } from "../constants/words";
import { WORDOFTHEDAY } from "../utils/getRandomWord";

interface Props {
  gameState: {
    currentGuess: string[];
    prevGuesses: string[];
    currentRow: number;
    gameWon: boolean;
  };
  handleKeyPress: (e: KeyboardEvent) => void;
}

const Table = ({
  gameState: { currentGuess, prevGuesses, currentRow, gameWon },
  handleKeyPress,
}: Props): JSX.Element => {
  const filledRows = Array.from(Array(currentRow));
  const emptyRows = Array.from(Array(5 - Math.min(filledRows.length, 5)));

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [currentGuess, handleKeyPress]);

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
