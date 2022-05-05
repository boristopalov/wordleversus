import { useRouter } from "next/router";
import React from "react";
import { useForm } from "react-hook-form";
import { useSocket } from "../context/socketContext";

interface Props {}

interface Inputs {
  username: string;
  password: string;
}

const Login = (props: Props): JSX.Element => {
  const socket = useSocket();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  console.log(errors);
  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        const { username, password } = data;
        socket?.emit("login", username, password);
        router.push("/");
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
