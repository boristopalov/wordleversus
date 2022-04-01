export const validateRegisterInput = async (
  username: string,
  password: string
) => {
  const userRe = /^[a-zA-Z0-9_]{4,30}$/;
  if (!username.match(userRe)) {
    return [
      {
        field: "username",
        message:
          "username must be at least 4 characters & only contain alphanumeric characters",
      },
    ];
  }
  const passwordRe =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  if (!password.match(passwordRe)) {
    return [
      {
        field: "password",
        message:
          "password must be at least 8 characters and contain 1 letter, 1 number, and 1 special character",
      },
    ];
  }
};
