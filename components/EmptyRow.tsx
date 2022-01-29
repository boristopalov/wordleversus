import Cell from "./Cell";
import styles from "./Game.module.css";

const EmptyRow = (): JSX.Element => {
  const emptyCells = Array.from(Array(5));
  return (
    <div className={styles.rowWrapper}>
      {emptyCells.map((_, i) => (
        <Cell status="grey" key={i} />
      ))}
    </div>
  );
};

export default EmptyRow;
