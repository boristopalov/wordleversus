export default interface OpponentGameState {
  opponentPrevGuesses: string[];
  opponentCurrentGuess: string[];
  opponentCurrentRow: number;
  opponentGameWon: boolean;
}
