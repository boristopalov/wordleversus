import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import React from "react";
import { useForm } from "react-hook-form";
import LoginForm from "../components/login/LoginForm";
import Nav from "../components/nav/Nav";

interface Props {}

const Login = (props: Props): JSX.Element => {
  // console.log(errors);
  return (
    <>
      <Nav />
      <LoginForm />
    </>
  );
};

export default Login;
