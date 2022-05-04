import React from "react";
import { gql, useQuery } from "@apollo/client";

const GET_GAME = gql`
  query getGameByRoom($roomId: String!) {
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

  console.log(roomId);

  if (loading) {
    return <h1>Loading...</h1>;
  }
  if (error) {
    console.log(error);
    return <div>{error.graphQLErrors}</div>;
  }

  return <div>{data}</div>;
};

export default RoomLoader;
