import styles from "./Game.module.css";
interface Props {
  value?: string;
  status: string;
}

const Cell = ({ value }: Props): JSX.Element => {
  return <div className={styles.cellWrapper}> {value} </div>;
};

export default Cell;
