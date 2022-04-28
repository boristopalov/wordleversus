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
  p2PrevGuesses!: String[];

  @Field({ nullable: true, defaultValue: 0 })
  p2CurrentRow!: Number;

  @Field(() => [String], { nullable: true, defaultValue: [] })
  p2CurrentGuess!: String[];

  @Field({ nullable: true, defaultValue: false })
  p2GameWon!: Boolean;

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
