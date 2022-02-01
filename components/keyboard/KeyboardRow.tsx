import React from "react";
import Key from "./Key";

interface Props {
  letters: string[];
  gameState: {
    currentGuess: string[];
    prevGuesses: string[];
    currentRow: number;
    gameWon: boolean;
  };
  handleKeyBoardClick: (e: React.MouseEvent<HTMLElement>) => void;
}

const KeyboardRow = ({
  letters,
  gameState,
  handleKeyBoardClick,
}: Props): JSX.Element => {
  return (
    <div>
      {letters.map((letter, i) => (
        <Key
          key={i}
          letter={letter}
          status="absent"
          gameState={gameState}
          handleKeyBoardClick={handleKeyBoardClick}
        />
      ))}
    </div>
  );
};

export default KeyboardRow;
