import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import React from "react";
import { useForm } from "react-hook-form";
import styles from "./register.module.css";

const REGISTER_USER = gql`
  mutation registerUser($username: String!, $password: String!) {
    registerUser(username: $username, password: $password) {
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
  confirmPassword: string;
}

const RegisterForm = (props: Props): JSX.Element => {
  const [registerUser, { data, loading, error }] = useMutation(REGISTER_USER);
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
    <div className={styles.horizontalCenter}>
      <div className={styles.container}>
        <form
          className={styles.form}
          onSubmit={handleSubmit(async (data) => {
            const { username, password } = data;
            const res = await registerUser({
              variables: { username: username, password: password },
              update: (cache, { data }) => {
                const registeredUser = data?.registerUser.user;
                cache.writeQuery({
                  query: LOGGED_IN,
                  data: { me: registeredUser },
                });
              },
            });
            console.log("gql res", res);
            const { errors, user } = res.data.registerUser;
            if (errors) {
              console.error(errors);
            }
            if (user)
              router.push({ pathname: "/", query: { from: "register" } });
          })}
        >
          <label className={styles.widthFull}>
            Username
            <input
              className={styles.widthFull}
              {...register("username", {
                required: "Please fill out this field",
                pattern: {
                  value: userRe,
                  message:
                    "Username must be at least 4 characters & only contain alphanumeric characters.",
                },
              })}
            />
          </label>
          <p className={styles.error}>{errors.username?.message}</p>
          <div className={styles.passwords}>
            <label className={styles.widthFull}>
              Password
              <input
                className={styles.widthFull}
                {...register("password", {
                  required: "Please fill out this field",
                  pattern: {
                    value: passwordRe,
                    message:
                      "Password must be at least 8 characters and contain 1 letter, 1 number, and 1 special character.",
                  },
                })}
                type="password"
              />
            </label>
            <p className={styles.error}>{errors.password?.message}</p>
            <label className={styles.widthFull}>
              Confirm Password
              <input
                className={styles.widthFull}
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  // https://stackoverflow.com/questions/70480928/how-to-validate-password-and-confirm-password-in-react-hook-form-is-there-any-v
                  validate: (val: string) => {
                    if (watch("password") !== val) {
                      return "Your passwords do not match.";
                    }
                  },
                })}
                type="password"
              />
            </label>
            <p className={styles.error}>{errors.confirmPassword?.message}</p>
          </div>
          <button type="submit" className={styles.submitBtn}>
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
