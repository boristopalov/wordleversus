import React from "react";
import styles from "./Keyboard.module.css";

interface Props {
  letter: string;
  status: string;
  handleKeyBoardClick: (e: React.MouseEvent<HTMLElement>) => void;
}

const Key = ({ letter, status, handleKeyBoardClick }: Props): JSX.Element => {
  // console.log(letter);
  let fill = styles.default;
  if (status === "present") {
    fill = styles.present;
  }
  if (status === "absent") {
    fill = styles.absent;
  }
  if (status === "correct") {
    fill = styles.correct;
  }
  return (
    <button onClick={handleKeyBoardClick} data-key={letter} className={fill}>
      {letter}
    </button>
  );
};

export default Key;
