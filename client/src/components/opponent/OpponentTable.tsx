import { useEffect } from "react";
import OpponentEmptyRow from "./OpponentEmptyRow";
import OpponentRow from "./OpponentFilledRow";

interface Props {
  gameState: {
    prevGuesses: string[];
    currentRow: number;
    gameWon: boolean;
  };
  handleKeyPress: (e: KeyboardEvent) => void;
}

const OpponentTable = ({
  gameState: { prevGuesses, currentRow, gameWon },
  handleKeyPress,
}: Props): JSX.Element => {
  const filledRows = Array.from(Array(prevGuesses.length));
  const emptyRows = Array.from(Array(6 - Math.min(filledRows.length, 6)));

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <div>
      {filledRows.map((_, i) => (
        <OpponentRow key={i} rowValue={prevGuesses[i]} />
      ))}

      {emptyRows.map((_, i) => (
        <OpponentEmptyRow key={i} />
      ))}
    </div>
  );
};

export default OpponentTable;
