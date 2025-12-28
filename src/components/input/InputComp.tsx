import React, { useState } from "react";
import styles from "./inputcomp.module.scss";
import { FiEye } from "react-icons/fi";
import { FiEyeOff } from "react-icons/fi";
import NavIcon from "../icons/NavIcon";

type Props = {
  label?: string;
  placeholder?: string;
  inputType?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  error?: string | null;
  icon?: string;
  disabled?: boolean;
};

const InputComp = (props: Props) => {
  const {
    label,
    placeholder,
    inputType,
    value,
    onChange,
    name,
    error,
    icon,
    disabled = false,
  } = props;
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
        {icon && (
          <div className={styles.iconCont}>
            <NavIcon name={icon} className={styles.icon} />
          </div>
        )}
        <input
          name={name}
          type={showPassword ? "text" : inputType}
          placeholder={placeholder || ""}
          className={`${styles.input} ${icon ? styles.isIcon : ""}`}
          value={value}
          onChange={onChange}
          disabled={disabled}
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
