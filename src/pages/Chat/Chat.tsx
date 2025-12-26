import styles from "./chat.module.scss";
import Conversation from "./components/conversation/Conversation";
import SelectFilter from "./components/filters/SelectFilter";
import ChatSearch from "./components/search/ChatSearch";
import { useAppSelector } from "../../types/reduxHooks";
import { Link } from "react-router-dom";

const Chat = () => {
  const data = useAppSelector((state) => state.userSlice.userProfile);
  const openMobileChat = useAppSelector((state) => state.chatSlice.open);

  return (
    <section
      className={`${styles.container} ${
        openMobileChat ? styles.msgWrapper : ""
      } `}
    >
      <div className={styles.headerContainer}>
        <h1>VibeChat</h1>
        <Link to={"/profile"}>
          <img
            src={data.picture?.url}
            alt="photo"
            className={styles.profilePhoto}
          />
        </Link>
      </div>
      <ChatSearch />
      <SelectFilter />
      <Conversation />
    </section>
  );
};

export default Chat;
