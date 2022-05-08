import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import React from "react";
import { useForm } from "react-hook-form";
import { useSocket } from "../context/socketContext";

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

interface Props {}

interface Inputs {
  username: string;
  password: string;
}

const Login = (props: Props): JSX.Element => {
  const router = useRouter();
  const [loginUser, { data, loading, error }] = useMutation(LOGIN_USER);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  // console.log(errors);
  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        const { username, password } = data;
        const res = await loginUser({
          variables: { username: username, password: password },
        });
        console.log("gql res", res);
        const { errors, user } = res.data.loginUser;
        if (errors) {
          console.log(errors);
        }
        if (user) router.push("/");
      })}
    >
      <label>
        Username
        <input
          {...register("username", { required: "Please fill out this field" })}
        />
      </label>
      <p>{errors.username?.message}</p>

      <label>
        Password
        <input
          {...register("password", { required: "Please fill out this field" })}
          type="password"
        />
      </label>
      <p>{errors.password?.message}</p>
      <input type="submit" />
    </form>
  );
};

export default Login;
