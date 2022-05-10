import React from "react";
import { letterStatuses } from "../../utils/utils";
import Key from "./Key";
import styles from "./Keyboard.module.css";

interface Props {
  solution: string;
  letters: string[];
  prevGuesses: string[];
  handleKeyBoardClick: (e: React.MouseEvent<HTMLElement>) => void;
}

const KeyboardRow = ({
  solution,
  letters,
  prevGuesses,
  handleKeyBoardClick,
}: Props): JSX.Element => {
  return (
    <div className={styles.row}>
      {letters.map((letter, i) => {
        const lowercaseLetter = letter.toLowerCase();
        let statuses: {
          [key: string]: string;
        } = {};
        if (prevGuesses) {
          statuses = letterStatuses(solution, prevGuesses);
          // console.log(statuses);
        }
        return (
          <Key
            key={i}
            letter={letter}
            status={statuses[lowercaseLetter] || "default"}
            handleKeyBoardClick={handleKeyBoardClick}
          />
        );
      })}
    </div>
  );
};

export default KeyboardRow;
