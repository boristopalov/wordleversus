import React from "react";
import Nav from "../components/nav/Nav";
import RegisterForm from "../components/register/RegisterForm";

interface Props {}

const Register = (props: Props): JSX.Element => {
  return (
    <>
      <Nav />
      <RegisterForm />
    </>
  );
};

export default Register;
