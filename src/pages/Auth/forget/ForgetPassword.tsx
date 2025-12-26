import React, { useState } from "react";
import styles from "../styles/auth.module.scss";
import InputComp from "../../../components/input/InputComp";
import ButtonComp from "../../../components/button/Button";
import { Link } from "react-router-dom";
import { forgetApi } from "../../../api/authApi";
import { toastMessage } from "../../../utils/toastMessage";
import { forgetSchema } from "../../../validations/authSchema";

const ForgetPassword = () => {
  const [email, setEmail] = useState<string>("");
  const [errorState, setErrorState] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isEmailSent, setIsEmailSent] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setErrorState(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorState(null);

    const data: { email: string } = {
      email: email,
    };

    try {
      await forgetSchema.validate(data, { abortEarly: false });
    } catch (err: any) {
      setErrorState(err.message);
      return;
    }

    try {
      setLoading(true);
      const { message } = await forgetApi(data);
      toastMessage("success", message);
      setIsEmailSent(true);
    } catch (error: any) {
      const apiMessage =
        error?.response?.data?.message ||
        "Something went wrong, Please try again later";
      toastMessage("error", apiMessage);
      setIsEmailSent(false);
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
          <img src="/src/assets/images/forget.webp" alt="VibeChat background" />
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

            {isEmailSent ? (
              <div className={styles.successCont}>
                <p className={styles.subtitle}>
                  We’ve sent a secure password reset link to
                  <b> {email}</b>. Click the link inside to create a new
                  password and get back to chatting in no time.
                </p>

                <hr className={styles.divider} />

                <Link to="/login">
                  <ButtonComp btn="Back to Login" />
                </Link>
              </div>
            ) : (
              <>
                <form className={styles.form} onSubmit={handleSubmit}>
                  <p className={styles.subtitle}>
                    Happens to the best of us 😅 Enter your registered email,
                    and we’ll send you a secure link to reset your password.
                  </p>
                  <div className={styles.inputContainer}>
                    <InputComp
                      placeholder="Enter your email"
                      label="Email"
                      name="email"
                      inputType="email"
                      value={email}
                      onChange={handleChange}
                      error={errorState}
                    />
                  </div>

                  <ButtonComp btn="Send Reset Link" loading={loading} />
                </form>

                <hr className={styles.divider} />

                <div className={styles.formFooter}>
                  <p className={styles.rememberSection}>
                    Remembered your password?{" "}
                    <Link to={"/login"} className={styles.switchLink}>
                      Back to Login
                    </Link>
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

export default ForgetPassword;
