import styles from "./button.module.scss";

type Props = {
  btn?: string;
  loading?: boolean;
};

const ButtonComp = (props: Props) => {
  const { btn, loading } = props;
  return (
    <button
      className={`${styles.btn} ${loading ? styles.loading : ""} `}
      disabled={loading}
      type="submit"
      
    >
      {loading ? (
        <>
          <div className={styles.spinner}></div>Loading...
        </>
      ) : (
        btn
      )}
    </button>
  );
};

export default ButtonComp;
