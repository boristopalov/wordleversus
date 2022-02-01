import { useEffect, useState } from "react";
import Cell from "./Cell";
import styles from "./Game.module.css";
import { WORDOFTHEDAY } from "../utils/getRandomWord";

interface Props {
  rowValue: string;
}

const FilledRow = ({ rowValue }: Props): JSX.Element => {
  // const wordToGuess = WORDOFTHEDAY
  const wordToGuess = "hells".toUpperCase();
  useEffect(() => {
    setGuess(rowValue);
  }, [rowValue]);

  const [guess, setGuess] = useState(rowValue);
  return (
    <div className={styles.rowWrapper}>
      {guess &&
        guess.split("").map((letter, i) => {
          letter = letter.toUpperCase();
          if (wordToGuess[i] === letter) {
            return <Cell status="green" letter={letter} key={i} />;
          } else if (wordToGuess.includes(letter)) {
            return <Cell status="yellow" letter={letter} key={i} />;
          }
          return <Cell status="grey" letter={letter} key={i} />;
        })}
    </div>
  );
};

export default FilledRow;