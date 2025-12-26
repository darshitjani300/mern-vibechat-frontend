import React, { useEffect, useState } from "react";
import styles from "../styles/auth.module.scss";
import InputComp from "../../../components/input/InputComp";
import ButtonComp from "../../../components/button/Button";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { resetApi } from "../../../api/authApi";
import { toastMessage } from "../../../utils/toastMessage";
import { resetSchema } from "../../../validations/authSchema";

interface ErrorState {
  password: string | null;
  confirmPassword: string | null;
}

interface LoginData {
  password: string;
  confirmPassword: string;
}

interface Data {
  password: string;
  confirmPassword: string;
  token: string;
}

const ResetPassword = () => {
  const [userData, setUserData] = useState<LoginData>({
    password: "",
    confirmPassword: "",
  });
  const [errorState, setErrorState] = useState<ErrorState>({
    password: null,
    confirmPassword: null,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [isResetSuccess, setIsResetSuccess] = useState<boolean>(false);
  const [searchParams, _] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (searchParams.get("token") === null) {
      navigate("/");
    }
  }, []);

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

    setErrorState({ confirmPassword: null, password: null });

    const apiData: Data = {
      confirmPassword: userData?.confirmPassword,
      password: userData?.password,
      token: searchParams.get("token") || "",
    };

    try {
      await resetSchema.validate(apiData, { abortEarly: false });
    } catch (err: any) {
      const newErrors: ErrorState = {
        confirmPassword: null,
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
      const { message } = await resetApi(apiData);
      toastMessage("success", message);
      setIsResetSuccess(true);
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
          <img src="/src/assets/images/reset.webp" alt="VibeChat background" />
        </div>

        <div className={styles.formContainer}>
          <div className={styles.formWrapper}>
            <div className={styles.header}>
              <img
                src="/favicon.svg"
                alt="VibeChat logo"
                className={styles.logo}
              />
              <h1>VibeChat</h1>
            </div>

            {isResetSuccess ? (
              <div className={styles.successCont}>
                <h2 className={styles.title}>
                  Password updated successfully 🎉
                </h2>
                <p className={styles.subtitle}>
                  You’re all set, <strong>VibeChatter</strong>! Your password
                  has been securely updated — you can now sign in and continue
                  your conversations without missing a beat.
                </p>

                <hr className={styles.divider} />

                <Link to="/login">
                  <ButtonComp btn="Back to Login" />
                </Link>
              </div>
            ) : (
              <>
                <form className={styles.form} onSubmit={handleSubmit}>
                  {" "}
                  <p className={styles.subtitle}>
                    Looks like you’re getting back in — great to have you again!
                    Choose a strong password to secure your VibeChat account.
                  </p>
                  <div className={styles.inputContainer}>
                    <InputComp
                      placeholder="Enter new password"
                      label="New Password"
                      inputType="password"
                      name="password"
                      value={userData.password}
                      onChange={handleChange}
                      error={errorState.password}
                    />
                    <InputComp
                      placeholder="Confirm new password"
                      label="Confirm Password"
                      inputType="password"
                      name="confirmPassword"
                      value={userData.confirmPassword}
                      onChange={handleChange}
                      error={errorState.confirmPassword}
                    />
                  </div>
                  <ButtonComp btn="Reset Password" loading={loading} />
                </form>

                <hr className={styles.divider} />

                <div className={styles.formFooter}>
                  <p className={styles.rememberSection}>
                    Remembered your password?{" "}
                    <span className={styles.switchLink}>
                      <Link to="/login">Back to Login</Link>
                    </span>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResetPassword;
