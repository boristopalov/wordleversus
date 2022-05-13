import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import React from "react";
import { useForm } from "react-hook-form";
import styles from "./login.module.css";

const LOGIN_USER = gql`
  mutation loginUser($username: String!, $password: String!) {
    loginUser(username: $username, password: $password) {
      errors {
        field
        message
      }
      user {
        id
        username
      }
    }
  }
`;

const LOGGED_IN = gql`
  query me {
    me {
      id
      username
    }
  }
`;

interface Props {}

interface Inputs {
  username: string;
  password: string;
}

interface Props {}

const LoginForm = (props: Props): JSX.Element => {
  const router = useRouter();
  const [loginUser, { data, loading, error }] = useMutation(LOGIN_USER);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  return (
    <div className={styles.horizontalCenter}>
      <div className={styles.container}>
        <form
          className={styles.form}
          onSubmit={handleSubmit(async (data) => {
            const { username, password } = data;
            const res = await loginUser({
              variables: { username: username, password: password },
              update: (cache, { data }) => {
                const loggedInUser = data?.loginUser.user;
                // don't directly mutate userData
                // reads the user data from the cache
                // not used in this case though since we are only reading
                // const userData = cache.readQuery<MeQuery>({ query: MeDocument });

                // writes back to the cache
                cache.writeQuery({
                  query: LOGGED_IN,
                  data: { me: loggedInUser },
                });
                // cache.evict({ fieldName: "posts" });
              },
            });
            console.log("gql res", res);
            const { errors, user } = res.data.loginUser;
            if (errors) {
              console.log(errors);
            }
            if (user) router.push("/");
          })}
        >
          <label className={styles.widthFull}>
            Username
            <input
              className={styles.widthFull}
              {...register("username", {
                required: "Please fill out this field",
              })}
            />
          </label>
          <p>{errors.username?.message}</p>

          <label className={styles.widthFull}>
            Password
            <input
              className={styles.widthFull}
              {...register("password", {
                required: "Please fill out this field",
              })}
              type="password"
            />
          </label>
          <p>{errors.password?.message}</p>
          <button type="submit" className={styles.submitBtn}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
