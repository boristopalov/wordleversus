import User from "../entities/User";
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
import { validateRegisterInput } from "../utils/validateRegisterInput";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
const scryptAsync = promisify(scrypt);

@ObjectType()
class FieldError {
  @Field()
  field?: string;

  @Field()
  message?: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver(() => User)
class UserResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() { db, req }: Context) {
    // not logged in
    if (!req.session.userId) {
      return null;
    }
    // if the user has a cookie they are logged in
    const [me] = await db("users").where({ id: req.session.userId });
    return me;
  }

  @Mutation(() => UserResponse)
  async registerUser(
    @Arg("username") username: string,
    @Arg("password") password: string,
    @Ctx() { db }: Context
  ) {
    const errors = await validateRegisterInput(username, password);
    if (errors) {
      return { errors };
    }
    const salt = randomBytes(16).toString("hex");
    const buffer = (await scryptAsync(password, salt, 64)) as Buffer;
    const hashedPassword = `${salt}.${buffer.toString("hex")}`;
    const [user] = await db("users")
      .insert({ username: username, password: hashedPassword })
      .returning("*");
    // return new Promise((resolve, _) => resolve(user));
    return { user };
  }

  @Mutation(() => UserResponse)
  async loginUser(
    @Arg("username") username: string,
    @Arg("password") password: string,
    @Ctx() { db, req }: Context
  ) {
    const user = await db("users").where("username", username).first();

    if (!user) {
      return {
        errors: [
          {
            field: "username",
            message: "an account with that username or email does not exist",
          },
        ],
      };
    }
    const [salt, hashedPassword] = user.password.split(".");
    const keyBuffer = Buffer.from(hashedPassword, "hex");
    const derivedBuffer = (await scryptAsync(password, salt, 64)) as Buffer;
    // compare the new supplied password with the stored hashed password
    if (!timingSafeEqual(keyBuffer, derivedBuffer)) {
      return {
        errors: [
          {
            field: "password",
            message: "incorrect password",
          },
        ],
      };
    }
    req.session.userId = user.id;
    return { user };
  }

  @Mutation(() => Boolean)
  async logoutUser(@Ctx() { req, res }: Context) {
    // console.log(req.session);
    return new Promise((resolve) =>
      req.session.destroy((e) => {
        res.clearCookie("qid");
        if (e) {
          console.error(e);
          resolve(false);
          return;
        }
        resolve(true);
      })
    );
  }
}

export default UserResolver;
