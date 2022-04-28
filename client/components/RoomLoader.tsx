import React from "react";
import { gql, useQuery } from "@apollo/client";

const GET_GAME = gql`
  query getGameByRoom($roomId: Float!) {
    getGameByRoom(roomId: $roomId) {
      errors {
        message
      }
      game {
        id
        roomId
        p1PrevGuesses
      }
    }
  }
`;

interface Props {
  roomId: String;
}

const RoomLoader = ({ roomId }: Props): JSX.Element => {
  const { loading, error, data } = useQuery(GET_GAME, {
    variables: roomId,
    skip: !roomId,
  });

  return <div></div>;
};

export default RoomLoader;
