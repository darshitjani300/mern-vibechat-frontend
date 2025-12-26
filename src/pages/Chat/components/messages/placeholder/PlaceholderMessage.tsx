import styles from "./placeholdermessage.module.scss";

const PlaceholderMessage = () => {
  return (
    <div className={styles.messageContainer}>
      <div className={styles.container}>
        <img src="/favicon.svg" alt="Chat" className={styles.imageContainer} />
        <h5 className={styles.headerChat}>Chat anytime, anywhere</h5>
      </div>
    </div>
  );
};

export default PlaceholderMessage;
