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
  // async getGame(
  //   @Arg("id")
  //   @Ctx()
  //   { db }: Context
  // ) {}
  @Mutation(() => GameResponse)
  async createGame(
    @Arg("roomId") roomId: String,
    @Arg("p1Id") p1Id: Number,
    @Arg("p2Id") p2Id: Number,
    @Ctx() { db }: Context
  ) {
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
}

export default GameResolver;
