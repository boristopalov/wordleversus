import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
class Game {
  @Field(() => ID)
  id!: number;

  @Field()
  roomId!: string;

  @Field()
  gameState!: GameState;

  @Field()
  created_at: Date = new Date();

  @Field()
  updated_at: Date = new Date();
}

@ObjectType()
class GameState {
  @Field({ nullable: true })
  prevGuesses?: string[];

  @Field({ nullable: true })
  currentRow?: number;

  @Field({ nullable: true })
  currentGuess?: string[];

  @Field({ nullable: true })
  gameWon?: boolean;

  @Field({ nullable: true })
  opponentPrevGuesses?: string[];

  @Field({ nullable: true })
  opponentCurrentRow?: number;

  @Field({ nullable: true })
  opponentCurrentGuess?: string[];

  @Field({ nullable: true })
  opponentGameWon?: boolean;
}

export default Game;
