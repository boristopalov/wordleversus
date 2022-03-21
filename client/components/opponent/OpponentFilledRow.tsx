import { useEffect, useState } from "react";
import OpponentCell from "./OpponentCell";
import styles from "../Table.module.css";

interface Props {
  rowValue: string;
}

const OpponentFilledRow = ({ rowValue }: Props): JSX.Element => {
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
            return <OpponentCell status="green" key={i} />;
          } else if (wordToGuess.includes(letter)) {
            return <OpponentCell status="yellow" key={i} />;
          }
          return <OpponentCell status="grey" key={i} />;
        })}
    </div>
  );
};

export default OpponentFilledRow;
