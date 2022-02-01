import { WORDS } from "../constants/words";
const getRandomWord = () => {
  const wordIdx = Math.floor(Math.random() * 2315);
  return WORDS[wordIdx];
};

export const WORDOFTHEDAY = getRandomWord().toUpperCase();
