import React from "react";
import KeyboardRow from "./KeyboardRow";

interface Props {
  gameState: {
    currentGuess: string[];
    prevGuesses: string[];
    currentRow: number;
    gameWon: boolean;
  };
  guessedCorrect: string[];
  guessedAbsent: string[];
  guessedPresent: string[];
  handleKeyBoardClick: (e: React.MouseEvent<HTMLElement>) => void;
}

const Keyboard = ({ gameState, handleKeyBoardClick }: Props): JSX.Element => {
  const topLetters = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
  const midLetters = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
  const botLetters = ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"];

  return (
    <div>
      <KeyboardRow
        letters={topLetters}
        gameState={gameState}
        handleKeyBoardClick={handleKeyBoardClick}
      />
      <KeyboardRow
        letters={midLetters}
        gameState={gameState}
        handleKeyBoardClick={handleKeyBoardClick}
      />
      <KeyboardRow
        letters={botLetters}
        gameState={gameState}
        handleKeyBoardClick={handleKeyBoardClick}
      />
    </div>
  );
};

export default Keyboard;
