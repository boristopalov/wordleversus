import { SOLUTIONS } from "../constants/solutions";
export const getRandomSolution = () => {
  const wordIdx = Math.floor(Math.random() * 2315);
  return SOLUTIONS[wordIdx].toUpperCase();
};
