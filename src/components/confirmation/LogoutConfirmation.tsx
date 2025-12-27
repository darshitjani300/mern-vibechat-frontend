import React, { useState } from "react";
import styles from "./logoutConfirmation.module.scss";
import { logout } from "../../api/authApi";
import { toastMessage } from "../../utils/toastMessage";

interface Iprops {
  onClose: () => void;
}

const LogoutConfirmation: React.FC<Iprops> = ({ onClose }) => {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const response = await logout();

      if (response.status === true) {
        toastMessage("success", "Sign-out");
        window.location.reload();
      }

      setLoading(false);
    } catch (error) {
      toastMessage("error", "Error signing out");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.outterContainer} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.title}>Logout</h3>
        <p className={styles.description}>Are you sure you want to logout?</p>

        <div className={styles.actions}>
          <button
            className={`${styles.btn} ${styles.cancel}`}
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className={`${styles.btn} ${styles.danger}`}
            disabled={loading}
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmation;
