import { useEffect, useState } from "react";
import Keyboard from "../../components/keyboard/Keyboard";
import Table from "../../components/player/Table";
import OpponentTable from "../../components/opponent/OpponentTable";
import GameState from "../../types/OpponentGameState";
import styles from "../../styles/Game.module.css";
import { VALIDGUESSES } from "../../constants/validGuesses";
import { WORDS } from "../../constants/words";
import { WORDOFTHEDAY } from "../../utils/getRandomWord";
import {
  fetchPrevGuessesFromStorage,
  fetchCurrentRowFromStorage,
  fetchGameWonFromStorage,
  fetchOpponentPrevGuessesFromStorage,
  fetchOpponentCurrentRowFromStorage,
  fetchOpponentGameWonFromStorage,
} from "../../utils/fetchFromStorage";
import { useRouter } from "next/router";
import { useSocket } from "../../context/socketContext";

import { gql, useQuery } from "@apollo/client";

const GET_GAME = gql`
  query getGameByRoom($roomId: String!) {
    getGameByRoom(roomId: $roomId) {
      errors {
        message
      }
      game {
        roomId
        p1PrevGuesses
        p1CurrentRow
        p1CurrentGuess
        p1GameWon
        p2PrevGuesses
        p2CurrentRow
        p2CurrentGuess
        p2GameWon
      }
    }
  }
`;

const Game = (): JSX.Element => {
  const [currentGuess, setCurrentGuess] = useState<string[]>([]);
  const [prevGuesses, setPrevGuesses] = useState<string[]>([]);
  const [currentRow, setCurrentRow] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const router = useRouter();
  const socket = useSocket();
  const [opponentCurrentGuess, setOpponentCurrentGuess] = useState<string[]>(
    []
  );
  const [opponentPrevGuesses, setOpponentPrevGuesses] = useState<string[]>([]);
  const [opponentCurrentRow, setOpponentCurrentRow] = useState(0);
  const [opponentGameWon, setOpponentGameWon] = useState(false);

  const roomId =
    typeof router.query.roomId === "string" ? router.query.roomId : null;
  console.log(roomId);
  const { loading, error, data } = useQuery(GET_GAME, {
    variables: { roomId: roomId },
    skip: !roomId,
    // onCompleted: () =>
  });

  const handleEnter = () => {
    const guessString = currentGuess.join("").toLowerCase();
    if (guessString === "hells") {
      setGameWon(() => {
        localStorage.setItem("gameWon", "true");
        return true;
      });
    }

    if (
      currentGuess.length === 5 &&
      currentRow < 6 &&
      (VALIDGUESSES.includes(guessString) || WORDS.includes(guessString))
    ) {
      setCurrentGuess(() => {
        localStorage.setItem("currentGuess", JSON.stringify([]));
        return [];
      });
      setPrevGuesses((prevGuesses) => {
        const newGuesses = [...prevGuesses, guessString];
        localStorage.setItem("prevGuesses", JSON.stringify(newGuesses));
        return newGuesses;
      });
      setCurrentRow((currentRow) => {
        const nextRow = currentRow + 1;
        localStorage.setItem("currentRow", JSON.stringify(nextRow));
        return nextRow;
      });
    }
  };

  const handleBackspace = () => {
    setCurrentGuess((prevGuess) => {
      const newGuess = prevGuess.slice(0, prevGuess.length - 1);
      localStorage.setItem("currentGuess", JSON.stringify(newGuess));
      return newGuess;
    });
  };

  const handleLetter = (key: string) => {
    if (currentGuess.length < 5) {
      setCurrentGuess((prevGuess) => {
        const newGuess = [...prevGuess, key];
        localStorage.setItem("currentGuess", JSON.stringify(newGuess));
        return newGuess;
      });
    }
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    const key = e.key.toUpperCase();
    if (!gameWon && !opponentGameWon) {
      if (key === "ENTER") {
        handleEnter();
      }
      if (key === "BACKSPACE") {
        handleBackspace();
      }
      if (key.length == 1 && key >= "A" && key <= "Z") {
        handleLetter(key);
      }
    }
  };

  const handleKeyBoardClick = (e: React.MouseEvent<HTMLElement>) => {
    const key = e.currentTarget.getAttribute("data-key");
    if (!gameWon && !opponentGameWon) {
      if (key === "ENTER") {
        handleEnter();
      }
      if (key === "BACKSPACE") {
        handleBackspace();
      }
      if (key?.length == 1 && key >= "A" && key <= "Z") {
        handleLetter(key);
      }
    }
  };

  useEffect(() => {
    setPrevGuesses(p1PrevGuesses);
    setCurrentRow(p1CurrentRow);
    setGameWon(p1GameWon);
    setOpponentPrevGuesses(p2PrevGuesses);
    setOpponentCurrentRow(p2CurrentRow);
    setOpponentGameWon(p2GameWon);
    const updateOpponentGameState = ({
      opponentCurrentGuess,
      opponentCurrentRow,
      opponentPrevGuesses,
      opponentGameWon,
    }: GameState) => {
      setOpponentCurrentGuess(opponentCurrentGuess);
      setOpponentCurrentRow(opponentCurrentRow);
      setOpponentPrevGuesses(opponentPrevGuesses);
      setOpponentGameWon(opponentGameWon);
      localStorage.setItem(
        "opponentCurrentGuess",
        JSON.stringify(opponentCurrentGuess)
      );
      localStorage.setItem(
        "opponentCurrentRow",
        JSON.stringify(opponentCurrentRow)
      );
      localStorage.setItem(
        "opponentPrevGuesses",
        JSON.stringify(opponentPrevGuesses)
      );
      localStorage.setItem("opponentGameWon", JSON.stringify(opponentGameWon));
    };
    socket?.on("on_update_game", updateOpponentGameState);
    return () => {
      socket?.off("on_update_game", updateOpponentGameState);
    };
  }, []);

  useEffect(() => {
    socket?.emit(
      "update_game",
      {
        gameState: {
          currentGuess: currentGuess,
          prevGuesses: prevGuesses,
          currentRow: currentRow,
          gameWon: gameWon,
        },
      },
      roomId
    );
  }, [currentRow]);

  if (loading) {
    return <h1>Loading...</h1>;
  }
  if (error) {
    console.log(error);
    return <div>{error.graphQLErrors}</div>;
  }
  if (!data.getGameByRoom.game) {
    return <></>;
  }

  const {
    p1PrevGuesses,
    p1CurrentRow,
    p1CurrentGuess,
    p1GameWon,
    p2PrevGuesses,
    p2CurrentRow,
    p2CurrentGuess,
    p2GameWon,
  } = data.getGameByRoom.game;

  console.log(data.getGameByRoom.game);

  return (
    <div className={styles.wrapper}>
      {/* {opponentGameState} */}
      <div className={styles.tableWrapper}>
        <Table
          gameState={{
            currentGuess: p1CurrentGuess,
            prevGuesses: p1PrevGuesses,
            currentRow: p1CurrentRow,
            gameWon: p1GameWon,
          }}
          handleKeyPress={handleKeyPress}
        />
        <OpponentTable
          gameState={{
            prevGuesses: p2PrevGuesses,
            currentRow: p2CurrentRow,
            gameWon: p2GameWon,
          }}
          handleKeyPress={handleKeyPress}
        />
      </div>
      <Keyboard
        gameState={{
          currentGuess: p1CurrentGuess,
          prevGuesses: p1PrevGuesses,
          currentRow: p1CurrentRow,
          gameWon: p1GameWon,
        }}
        guessedAbsent={[]}
        guessedCorrect={[]}
        guessedPresent={[]}
        handleKeyBoardClick={handleKeyBoardClick}
      />
    </div>
  );
};

export default Game;
