import styles from "./home.module.scss";
import Chat from "../Chat/Chat";
import Message from "../Chat/components/messages/Message";
import { useAppDispatch, useAppSelector } from "../../types/reduxHooks";
import PlaceholderMessage from "../Chat/components/messages/placeholder/PlaceholderMessage";
import { setAllChat } from "../../redux/features/chat/chat.slice";
import { getAllProfileApi } from "../../api/profile";
import { useEffect } from "react";

const Home = () => {
  const userSelected = useAppSelector((state) => state.userSlice.value);
  const dispatch = useAppDispatch();
  const selectedUser = userSelected.trim();

  useEffect(() => {
    const handleProfile = async () => {
      try {
        const res = await getAllProfileApi();
        dispatch(setAllChat(res.data?.profile));
      } catch (error) {
        dispatch(setAllChat([]));
      }
    };

    handleProfile();
  }, []);

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
