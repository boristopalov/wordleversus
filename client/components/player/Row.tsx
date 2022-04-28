import { useEffect, useState } from "react";
import Cell from "./Cell";
import styles from "../../styles/Table.module.css";

interface Props {
  rowValue: string;
}

const Row = ({ rowValue }: Props): JSX.Element => {
  useEffect(() => {
    setGuess(rowValue);
  }, [rowValue]);
  const [guess, setGuess] = useState(rowValue);
  const emptyCells = Array.from(Array(5 - guess.length));
  return (
    <div className={styles.rowWrapper}>
      {guess!.split("").map((letter, i) => {
        return <Cell status="blank" letter={letter} key={i} />;
      })}
      {emptyCells.map((_, i) => (
        <Cell status="blank" key={i} />
      ))}
    </div>
  );
};

export default Row;
