import type { NextPage } from "next";
import Table from "../components/Table";
import styles from "../styles/Home.module.css";

const App: NextPage = (): JSX.Element => {
  return (
    <div className={styles.wrapper}>
      <Table />
    </div>
  );
};

export default App;
