import NavIcon from "../../../../components/icons/NavIcon";
import styles from "./chatsearch.module.scss";

const ChatSearch = () => {
  return (
    <div className={styles.searchContainer}>
      <NavIcon name="IoIosSearch" className={styles.icon} size={28} />
      <input type="text" placeholder="Search..." className={styles.input} />
    </div>
  );
};

export default ChatSearch;
