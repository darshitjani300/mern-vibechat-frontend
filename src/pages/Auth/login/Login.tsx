import React, { useState } from "react";
import styles from "../styles/auth.module.scss";
import InputComp from "../../../components/input/InputComp";
import ButtonComp from "../../../components/button/Button";
import { Link, useNavigate } from "react-router-dom";
import { loginApi } from "../../../api/authApi";
import { toastMessage } from "../../../utils/toastMessage";
import { loginSchema } from "../../../validations/authSchema";
import { useAuth } from "../../../context/AuthContext";

interface ErrorState {
  email: string | null;
  password: string | null;
}

interface LoginData {
  email: string;
  password: string;
}

const Login = () => {
  const [userData, setUserData] = useState<LoginData>({
    email: "",
    password: "",
  });
  const [errorState, setErrorState] = useState<ErrorState>({
    email: null,
    password: null,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { checkAuth } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name) {
      setErrorState((prevState) => ({
        ...prevState,
        [name]: null,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setErrorState({ email: null, password: null });

    const dataObj: {
      email: string;
      password: string;
    } = {
      email: userData?.email,
      password: userData?.password,
    };

    try {
      await loginSchema.validate(dataObj, { abortEarly: false });
    } catch (err: any) {
      const newErrors: ErrorState = {
        email: null,
        password: null,
      };
      if (err.inner?.length > 0) {
        err.inner.forEach((error: { path: string; message: string }) => {
          newErrors[error.path as keyof ErrorState] = error.message;
        });
      }

      setErrorState(newErrors);
      return;
    }

    try {
      setLoading(true);
      const { message } = await loginApi(dataObj);
      await checkAuth();
      toastMessage("success", message);

      navigate("/home");
    } catch (error: any) {
      const apiMessage =
        error?.response?.data?.message ||
        "Something went wrong, Please try again later";
      toastMessage("error", apiMessage);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 200);
    }
  };

  return (
    <section>
      <div className={styles.container}>
        <div className={styles.imageContainer}>
          <img src="/src/assets/images/login.webp" alt="VibeChat background" />
        </div>

        <div className={styles.formContainer}>
          <div className={styles.formWrapper}>
            {/* Header */}
            <div className={styles.header}>
              <img
                src="/favicon.svg"
                alt="VibeChat logo"
                className={styles.logo}
              />
              <h1>VibeChat</h1>
            </div>

            {/* Login Form */}
            <form className={styles.form} onSubmit={handleSubmit}>
              <p className={styles.subtitle}>
                Connecting you with the people who matter — fast, secure, and
                seamless.
              </p>

              <div className={styles.inputContainer}>
                <InputComp
                  placeholder="Enter email"
                  label="Email"
                  name="email"
                  inputType="email"
                  value={userData?.email}
                  onChange={handleChange}
                  error={errorState.email}
                />
                <InputComp
                  placeholder="Enter password"
                  label="Password"
                  inputType="password"
                  value={userData?.password}
                  onChange={handleChange}
                  name={"password"}
                  error={errorState.password}
                />
              </div>

              <div className={styles.formFooter}>
                <div className={styles.rememberSection}>
                  <input type="checkbox" id="remember" />
                  <label htmlFor="checkbox">Remember me</label>
                </div>

                <Link to={"/forgetpassword"} className={styles.forgotLink}>
                  Forgot Password?
                </Link>
              </div>

              <ButtonComp btn="Login" loading={loading} />
            </form>

            <hr className={styles.divider} />

            {/* Alternate Login */}
            <div className={styles.altLogin}>
              <p className={styles.switchAuth}>
                New here?{" "}
                <Link to="/signup" className={styles.switchLink}>
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
