import { useEffect, useState } from "react";
import OpponentCell from "./OpponentCell";
import styles from "../../styles/Table.module.css";

interface Props {
  rowValue: string;
  solution: string;
}

const OpponentFilledRow = ({ rowValue, solution }: Props): JSX.Element => {
  useEffect(() => {
    setGuess(rowValue);
  }, [rowValue]);

  const [guess, setGuess] = useState(rowValue);
  return (
    <div className={styles.rowWrapper}>
      {guess &&
        guess.split("").map((letter, i) => {
          letter = letter.toUpperCase();
          if (solution[i] === letter) {
            return <OpponentCell status="green" key={i} />;
          } else if (solution.includes(letter)) {
            return <OpponentCell status="yellow" key={i} />;
          }
          return <OpponentCell status="grey" key={i} />;
        })}
    </div>
  );
};

export default OpponentFilledRow;
