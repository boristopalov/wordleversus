import type { NextPage } from "next";
import Keyboard from "../components/keyboard/Keyboard";
import Table from "../components/Table";
import styles from "../styles/Home.module.css";

const App: NextPage = (): JSX.Element => {
  return (
    <div className={styles.wrapper}>
      <Table />
      <Keyboard />
    </div>
  );
};

export default App;
