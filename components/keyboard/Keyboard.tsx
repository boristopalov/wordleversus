import React from "react";
import KeyboardRow from "./KeyboardRow";

interface Props {
  guessedCorrect: string[];
  guessedAbsent: string[];
  guessedPresent: string[];
}

const Keyboard = (): JSX.Element => {
  const topLetters = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"];
  const midLetters = ["a", "s", "d", "f", "g", "h", "j", "k", "l"];
  const botLetters = ["Enter", "z", "x", "c", "v", "b", "n", "m", "Backspace"];

  return (
    <div>
      <KeyboardRow letters={topLetters} />
      <KeyboardRow letters={midLetters} />
      <KeyboardRow letters={botLetters} />
    </div>
  );
};

export default Keyboard;
