import { useEffect, useState } from "react";
import Cell from "./Cell";
import styles from "./Game.module.css";

interface Props {
  rowValue: string[];
}

const Row = ({ rowValue }: Props): JSX.Element => {
  useEffect(() => {
    setGuess(rowValue);
  });
  const [guess, setGuess] = useState(rowValue);

  const emptyCells = Array.from(Array(5 - guess.length));
  return (
    <div className={styles.rowWrapper}>
      {guess.map((letter, i) => {
        return <Cell status="grey" value={letter} key={i} />;
      })}
      {emptyCells.map((_, i) => (
        <Cell status="grey" key={i} />
      ))}
    </div>
  );
};

export default Row;
