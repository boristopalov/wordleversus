import React from "react";

interface Props {
  letter: string;
  state: string;
}

const Key = ({ letter, state }: Props): JSX.Element => {
  return <button> {letter} </button>;
};

export default Key;
