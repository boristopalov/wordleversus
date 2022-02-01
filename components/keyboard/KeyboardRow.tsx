import React from "react";
import Key from "./Key";

interface Props {
  letters: string[];
}

const KeyboardRow: React.FC<Props> = ({ letters, children }): JSX.Element => {
  return (
    <div>
      {letters.map((letter, i) => (
        <Key key={i} letter={letter} state="absent" />
      ))}
    </div>
  );
};

export default KeyboardRow;
