import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
class Game {
  @Field(() => ID)
  id!: Number;

  @Field()
  roomId!: String;

  @Field(() => [String], { nullable: true, defaultValue: [] })
  p1PrevGuesses!: String[];

  @Field({ nullable: true, defaultValue: 0 })
  p1CurrentRow!: Number;

  @Field(() => [String], { nullable: true, defaultValue: [] })
  p1CurrentGuess!: String[];

  @Field({ nullable: true, defaultValue: false })
  p1GameWon!: Boolean;

  @Field(() => [String], { nullable: true, defaultValue: [] })
  opponentPrevGuesses!: String[];

  @Field({ nullable: true, defaultValue: 0 })
  opponentCurrentRow!: Number;

  @Field(() => [String], { nullable: true, defaultValue: [] })
  opponentCurrentGuess!: String[];

  @Field({ nullable: true, defaultValue: false })
  opponentGameWon!: Boolean;

  @Field()
  created_at: Date = new Date();

  @Field()
  updated_at: Date = new Date();
}

export default Game;

export interface GameState {
  p1PrevGuesses: String[];
  p1CurrentRow: Number;
  p1CurrentGuess: String[];
  p1GameWon: Boolean;
  p2PrevGuesses: String[];
  p2CurrentRow: Number;
  p2CurrentGuess: String[];
  p2GameWon: Boolean;
}
