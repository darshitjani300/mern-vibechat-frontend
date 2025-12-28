import styles from "./home.module.scss";
import Chat from "../Chat/Chat";
import Message from "../Chat/components/messages/Message";
import { useAppSelector } from "../../types/reduxHooks";
import PlaceholderMessage from "../Chat/components/messages/placeholder/PlaceholderMessage";

const Home = () => {
  const userSelected = useAppSelector((state) => state.userSlice.value);
  const selectedUser = userSelected.trim();

  return (
    <>
      <div className={styles.wrapper}>
        <Chat />
        {!selectedUser ? <PlaceholderMessage /> : <Message />}
      </div>
    </>
  );
};

export default Home;
