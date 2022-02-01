import { WORDS } from "../constants/words";
export const getWordOfTheDay = () => {
  const wordIdx = Math.floor(Math.random() * 2315);
  return WORDS[wordIdx];
};
