import { useEffect, useState } from "react";
import Cell from "./Cell";
import styles from "./Table.module.css";

interface Props {
  rowValue: string;
  solution: string;
}

const FilledRow = ({ rowValue, solution }: Props): JSX.Element => {
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
            return <Cell status="green" letter={letter} key={i} />;
          } else if (solution.includes(letter)) {
            return <Cell status="yellow" letter={letter} key={i} />;
          }
          return <Cell status="grey" letter={letter} key={i} />;
        })}
    </div>
  );
};

export default FilledRow;
