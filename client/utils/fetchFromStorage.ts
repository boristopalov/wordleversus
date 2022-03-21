export const fetchPrevGuessesFromStorage = () => {
  return JSON.parse(window.localStorage.getItem("prevGuesses") || "[]");
};

export const fetchCurrentRowFromStorage = () => {
  return JSON.parse(window.localStorage.getItem("currentRow") || "0");
};

export const fetchGameWonFromStorage = () => {
  return JSON.parse(window.localStorage.getItem("gameWon") || "false");
};

export const fetchOpponentPrevGuessesFromStorage = () => {
  // console.log("hello!");
  return JSON.parse(window.localStorage.getItem("opponentPrevGuesses") || "[]");
};

export const fetchOpponentCurrentRowFromStorage = () => {
  return JSON.parse(window.localStorage.getItem("opponentCurrentRow") || "0");
};

export const fetchOpponentGameWonFromStorage = () => {
  return JSON.parse(window.localStorage.getItem("opponentGameWon") || "false");
};
