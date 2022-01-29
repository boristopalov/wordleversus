// import { useState } from "react";
import { useEffect, useState } from "react";
import EmptyRow from "./EmptyRow";
import Row from "./Row";

const Table = (): JSX.Element => {
  // idx of current row
  // const [currentRow, setCurrentRow] = useState(0);
  const filledRows = Array.from(Array(0));
  const emptyRows = Array.from(Array(5 - filledRows.length));

  const [currentGuess, setCurrentGuess] = useState<string[]>([]);
  const handleKeyPress = (e: KeyboardEvent) => {
    setCurrentGuess((prevGuess) => {
      const key = e.key.toLowerCase();
      console.log(key);
      if (key === "backspace") {
        // prevGuess.pop();
        return prevGuess.slice(0, prevGuess.length - 1);
      }

      if (key === "enter") {
      }
      if (prevGuess.length < 5 && key >= "a" && key <= "z") {
        console.log("ok");
        return [...prevGuess, e.key];
      }
      console.log("filled");
      return prevGuess;
      // console.log("should be updated to:", [...prevGuess, e.key]);
      // console.log("current guess", currentGuess);
    });
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
  }, []);

  return (
    <div>
      <Row rowValue={currentGuess} />
      {emptyRows.map((_, i) => (
        <EmptyRow key={i} />
      ))}
    </div>
  );
};

export default Table;
