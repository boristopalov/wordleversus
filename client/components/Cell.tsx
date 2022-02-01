import styles from "./Game.module.css";
import classNames from "classnames";
interface Props {
  letter?: string;
  status: string;
}

// todo: add classNames library
const Cell = ({ letter, status }: Props): JSX.Element => {
  let filledStyle = "";
  if (status === "grey") {
    filledStyle = styles.filledGrey;
  }
  if (status === "yellow") {
    filledStyle = styles.filledYellow;
  }
  if (status === "green") {
    filledStyle = styles.filledGreen;
  }
  return (
    <div className={status === "blank" ? styles.cellWrapper : filledStyle}>
      {letter}
    </div>
  );
};

export default Cell;
