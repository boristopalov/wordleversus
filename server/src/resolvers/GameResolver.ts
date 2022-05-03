import Game from "../entities/Game";
import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import Context from "../types/Context";
// import { v4 as uuidv4 } from "uuid";

@ObjectType()
class SimpleError {
  @Field()
  message?: string;
}

@ObjectType()
class GameResponse {
  @Field(() => [SimpleError], { nullable: true })
  errors?: SimpleError[];

  @Field(() => Game, { nullable: true })
  game?: Game;
}

/** TODO
 * createGame
 *
 */

@Resolver(() => Game)
class GameResolver {
  @Query(() => GameResponse)
  async getGame(
    @Arg("id") id: Number,
    @Ctx()
    { db }: Context
  ) {
    const res = await db("games").where("id", id).first();
    if (!res) {
      return {
        errors: [
          {
            message: "Game not found.",
          },
        ],
      };
    }
    const game = {
      id: res.id,
      roomId: res.room_id,
      p1Id: res.p1_id,
      p2Id: res.p2_id,
      p1PrevGuesses: res.p1_prev_guesses,
      p1CurrentGuess: res.p1_current_guess,
      p1CurrentRow: res.p1_current_row,
      p1GameWon: res.p1_game_won,
      p2PrevGuesses: res.p2_prev_guesses,
      p2CurrentGuess: res.p2_current_guess,
      p2CurrentRow: res.p2_current_row,
      p2GameWon: res.p2_game_won,
    };
    console.log(game);
    return { game };
  }
  @Query(() => GameResponse)
  async getGameByRoom(
    @Arg("roomId") roomId: String,
    @Ctx()
    { db }: Context
  ) {
    const res = await db("games")
      .where("room_id", roomId)
      .orderByRaw("created_at desc")
      .first();
    if (!res) {
      return {
        errors: [
          {
            message: "Game with that room id not found.",
          },
        ],
      };
    }
    const game = {
      id: res.id,
      roomId: res.room_id,
      p1Id: res.p1_id,
      p2Id: res.p2_id,
      p1PrevGuesses: res.p1_prev_guesses,
      p1CurrentGuess: res.p1_current_guess,
      p1CurrentRow: res.p1_current_row,
      p1GameWon: res.p1_game_won,
      p2PrevGuesses: res.p2_prev_guesses,
      p2CurrentGuess: res.p2_current_guess,
      p2CurrentRow: res.p2_current_row,
      p2GameWon: res.p2_game_won,
    };
    console.log(game);
    return { game };
  }
  @Mutation(() => GameResponse)
  async createGame(
    @Arg("roomId") roomId: String,
    @Arg("p1Id") p1Id: Number,
    @Arg("p2Id") p2Id: Number,
    @Ctx() { db }: Context
  ) {
    const maybeExistingGame = await db("games")
      .where("room_id", roomId)
      .first();
    if (maybeExistingGame) {
      return {
        errors: [
          {
            message: "A game already exists for this room",
          },
        ],
      };
    }

    const p1 = await db("users").where("id", p1Id.toString()).first();
    if (!p1) {
      return {
        errors: [
          {
            message: "player 1 does not exist or not found in the database",
          },
        ],
      };
    }
    const p2 = await db("users").where("id", p2Id.toString()).first();
    if (!p2) {
      return {
        errors: [
          {
            message: "player 2 does not exist or not found in the database",
          },
        ],
      };
    }

    const [res] = await db("games")
      .insert({
        room_id: roomId,
        p1_id: p1Id,
        p2_id: p2Id,
        p1_prev_guesses: [],
        p1_current_guess: [],
        p1_current_row: 0,
        p1_game_won: false,
        p2_prev_guesses: [],
        p2_current_guess: [],
        p2_current_row: 0,
        p2_game_won: false,
      })
      .returning("*");
    // there is probably a more explicit way to do this but if we don't use camelCase then
    // GraphQL won't be able to recognize the fields since they are snake_case
    const game = {
      id: res.id,
      roomId,
      p1Id,
      p2Id,
      p1PrevGuesses: res.p1_prev_guesses,
      p1CurrentGuess: res.p1_current_guess,
      p1CurrentRow: res.p1_current_row,
      p1GameWon: res.p1_game_won,
      p2PrevGuesses: res.p2_prev_guesses,
      p2CurrentGuess: res.p2_current_guess,
      p2CurrentRow: res.p2_current_row,
      p2GameWon: res.p2_game_won,
    };
    // console.log(gameCamelCase);
    console.log(game);
    return { game };
  }

  @Mutation(() => Number)
  async updateGameState(
    @Arg("roomId") roomId: String,
    @Arg("p1CurrentGuess", () => [String]) p1CurrentGuess: String[],
    @Arg("p1CurrentRow") p1CurrentRow: Number,
    @Arg("p1PrevGuesses", () => [String]) p1PrevGuesses: String[],
    @Arg("p1GameWon") p1GameWon: Boolean,
    @Arg("p2CurrentGuess", () => [String]) p2CurrentGuess: String[],
    @Arg("p2CurrentRow") p2CurrentRow: Number,
    @Arg("p2PrevGuesses", () => [String]) p2PrevGuesses: String[],
    @Arg("p2GameWon") p2GameWon: Boolean,
    @Ctx() { db }: Context
  ) {
    const updatedId = await db("games").where({ room_id: roomId }).update({
      p1_current_guess: p1CurrentGuess,
      p1_current_row: p1CurrentRow,
      p1_game_won: p1GameWon,
      p1_prev_guesses: p1PrevGuesses,
      p2_current_guess: p2CurrentGuess,
      p2_current_row: p2CurrentRow,
      p2_game_won: p2GameWon,
      p2_prev_guesses: p2PrevGuesses,
    });
    return updatedId;
  }
}

export default GameResolver;
