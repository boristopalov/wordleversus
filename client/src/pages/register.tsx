import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";

interface Props {}

interface Inputs {
  username: string;
  password: string;
  confirmPassword: string;
}

const Register = (props: Props): JSX.Element => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  console.log(errors);
  return (
    <form
      onSubmit={handleSubmit((data) => {
        console.log(data);
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
      <label>
        Confirm Password
        <input
          {...register("confirmPassword", {
            required: "Please confirm your password",
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
