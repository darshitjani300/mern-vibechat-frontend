import * as Yup from "yup";

const usernameRules = /^[a-zA-Z]{6,}$/;
const passwordRules =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const loginSchema = Yup.object({
  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: Yup.string().matches(
    passwordRules,
    "Password must have at least 8 characters, one uppercase, one lowercase, one number and one special character"
  ),
});

export const signupSchema = Yup.object({
  username: Yup.string().matches(
    usernameRules,
    "Username must be characters only"
  ),
  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: Yup.string().matches(
    passwordRules,
    "Password must have at least 8 characters, one uppercase, one lowercase, one number and one special character"
  ),
});

export const forgetSchema = Yup.object({
  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),
});

export const resetSchema = Yup.object({
  password: Yup.string().matches(
    passwordRules,
    "Password must have at least 8 characters, one uppercase, one lowercase, one number and one special character"
  ),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
  token: Yup.string().required("Token is required"),
});
