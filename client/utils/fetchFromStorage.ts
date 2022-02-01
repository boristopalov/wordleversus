export const fetchPrevGuessesFromStorage = () => {
  return JSON.parse(window.localStorage.getItem("prevGuesses") || "[]");
};

export const fetchCurrentRowFromStorage = () => {
  return JSON.parse(window.localStorage.getItem("currentRow") || "0");
};

export const fetchGameStateFromStorage = () => {
  return JSON.parse(window.localStorage.getItem("gameWon") || "false");
};
