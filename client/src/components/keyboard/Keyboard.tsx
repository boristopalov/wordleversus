import React from "react";
import KeyboardRow from "./KeyboardRow";
import styles from "./Keyboard.module.css";
import { letterStatuses } from "../../utils/utils";

interface Props {
  solution: string;
  prevGuesses: string[];
  handleKeyBoardClick: (e: React.MouseEvent<HTMLElement>) => void;
}

const Keyboard = ({
  solution,
  prevGuesses,
  handleKeyBoardClick,
}: Props): JSX.Element => {
  const topLetters = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
  const midLetters = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
  const botLetters = ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "\u232b"];

  return (
    <div className={styles.container}>
      <KeyboardRow
        solution={solution}
        letters={topLetters}
        prevGuesses={prevGuesses}
        handleKeyBoardClick={handleKeyBoardClick}
      />
      <KeyboardRow
        solution={solution}
        letters={midLetters}
        prevGuesses={prevGuesses}
        handleKeyBoardClick={handleKeyBoardClick}
      />
      <KeyboardRow
        solution={solution}
        letters={botLetters}
        prevGuesses={prevGuesses}
        handleKeyBoardClick={handleKeyBoardClick}
      />
    </div>
  );
};

export default Keyboard;
