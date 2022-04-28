import OpponentCell from "./OpponentCell";
import styles from "../../styles/Table.module.css";

const OpponentEmptyRow = (): JSX.Element => {
  const emptyCells = Array.from(Array(5));
  return (
    <div className={styles.rowWrapper}>
      {emptyCells.map((_, i) => (
        <OpponentCell status="blank" key={i} />
      ))}
    </div>
  );
};

export default OpponentEmptyRow;
