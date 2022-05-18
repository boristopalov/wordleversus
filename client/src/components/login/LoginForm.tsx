import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import React, { useState } from "react";
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
    setError,
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
                cache.writeQuery({
                  query: LOGGED_IN,
                  data: { me: loggedInUser },
                });
              },
            });
            const { errors, user } = res.data.loginUser;
            if (errors) {
              const field = errors[0].field;
              if (field === "username") {
                setError("username", {
                  message: "An account with that username does not exist.",
                });
              }
              if (field === "password") {
                setError("password", { message: "Incorrect password." });
              }
            }
            if (user) router.push({ pathname: "/", query: { from: "login" } });
          })}
        >
          <label className={styles.widthFull}>
            Username
            <input
              className={styles.widthFull}
              {...register("username", {
                required: "Please fill out this field.",
              })}
            />
          </label>
          <p className={styles.error}>{errors.username?.message}</p>

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
          <p className={styles.error}>{errors.password?.message}</p>
          <button type="submit" className={styles.submitBtn}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
