import { gql, useMutation } from "@apollo/client";
import React from "react";
import { useForm } from "react-hook-form";
interface Props {}

interface Inputs {
  username: string;
  password: string;
}

const LOGIN_USER = gql`
  mutation loginUser($password: String!, $username: String!) {
    loginUser(password: $password, username: $username) {
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

const Login = (props: Props): JSX.Element => {
  const [loginUser, { data, loading, error }] = useMutation(LOGIN_USER);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  if (loading) return <div>Submitting...</div>;
  if (error) return <div>Submission error! {error.message}</div>;
  console.log(errors);
  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        const { username, password } = data;
        const res = await loginUser({ variables: { username, password } });
        console.log(res);
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
        />
      </label>
      <p>{errors.password?.message}</p>
      <input type="submit" />
    </form>
  );
};

export default Login;
