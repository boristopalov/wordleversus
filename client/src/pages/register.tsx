import { useRouter } from "next/router";
import React from "react";
import { useForm } from "react-hook-form";
import { useSocket } from "../context/socketContext";

interface Props {}

interface Inputs {
  username: string;
  password: string;
  confirmPassword: string;
}

const Register = (props: Props): JSX.Element => {
  const socket = useSocket();
  const router = useRouter();
  const userRe = /^[a-zA-Z0-9_]{4,30}$/;
  const passwordRe =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<Inputs>();

  console.log(errors);
  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        const { username, password } = data;
        socket?.emit("register", username, password);
        router.push("/");
      })}
    >
      <label>
        Username
        <input
          {...register("username", {
            required: "Please fill out this field",
            pattern: {
              value: userRe,
              message:
                "username must be at least 4 characters & only contain alphanumeric characters",
            },
          })}
        />
      </label>
      <p>{errors.username?.message}</p>
      <label>
        Password
        <input
          {...register("password", {
            required: "Please fill out this field",
            pattern: {
              value: passwordRe,
              message:
                "password must be at least 8 characters and contain 1 letter, 1 number, and 1 special character",
            },
          })}
          type="password"
        />
      </label>
      <p>{errors.password?.message}</p>
      <label>
        Confirm Password
        <input
          {...register("confirmPassword", {
            required: "Please confirm your password",
            // https://stackoverflow.com/questions/70480928/how-to-validate-password-and-confirm-password-in-react-hook-form-is-there-any-v
            validate: (val: string) => {
              if (watch("password") !== val) {
                return "Your passwords do not match";
              }
            },
          })}
          type="password"
        />
      </label>
      <p>{errors.confirmPassword?.message}</p>
      <input type="submit" />
    </form>
  );
};

export default Register;
