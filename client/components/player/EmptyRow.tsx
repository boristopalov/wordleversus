import Cell from "./Cell";
import styles from "../../styles/Table.module.css";

const EmptyRow = (): JSX.Element => {
  const emptyCells = Array.from(Array(5));
  return (
    <div className={styles.rowWrapper}>
      {emptyCells.map((_, i) => (
        <Cell status="blank" key={i} />
      ))}
    </div>
  );
};

export default EmptyRow;
