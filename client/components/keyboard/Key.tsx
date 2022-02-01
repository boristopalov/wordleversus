import React from "react";

interface Props {
  letter: string;
  status: string;
  gameState: {
    currentGuess: string[];
    prevGuesses: string[];
    currentRow: number;
    gameWon: boolean;
  };
  handleKeyBoardClick: (e: React.MouseEvent<HTMLElement>) => void;
}

const Key = ({
  letter,
  status,
  gameState: { currentGuess, prevGuesses, currentRow, gameWon },
  handleKeyBoardClick,
}: Props): JSX.Element => {
  const guessString = currentGuess.join("").toLowerCase();

  return (
    <button onClick={handleKeyBoardClick} data-key={letter}>
      {letter}
    </button>
  );
};

export default Key;
