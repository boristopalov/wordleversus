import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
class User {
  @Field(() => ID)
  id!: number;

  @Field()
  username!: string;

  password!: string;

  @Field()
  created_at: Date = new Date();

  @Field()
  updated_at: Date = new Date();
}

export default User;
