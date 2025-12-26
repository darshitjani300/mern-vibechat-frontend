import React, { useState } from "react";
import styles from "./inputcomp.module.scss";
import { FiEye } from "react-icons/fi";
import { FiEyeOff } from "react-icons/fi";

type Props = {
  label?: string;
  placeholder?: string;
  inputType?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  error?: string | null;
};

const InputComp = (props: Props) => {
  const { label, placeholder, inputType, value, onChange, name, error } = props;
  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={styles.inputContainer}>
      {label && (
        <label htmlFor={label} className={styles.label}>
          {label}
        </label>
      )}
      <div className={styles.inputPass}>
        <input
          name={name}
          type={showPassword ? "text" : inputType}
          placeholder={placeholder || ""}
          className={styles.input}
          value={value}
          onChange={onChange}
        />
        {inputType === "password" && (
          <div className={styles.eye} onClick={handleShowPassword}>
            {showPassword ? <FiEye /> : <FiEyeOff />}
          </div>
        )}
      </div>
        <p className={styles.errorMsg}>{error}</p>
    </div>
  );
};
export default InputComp;
