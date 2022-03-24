import User from "../entities/User";
import { Query, Resolver } from "type-graphql";

@Resolver(User)
class UserResolver {
  @Query(() => String)
  async me() {
    return "Hello";
  }
}

export default UserResolver;
