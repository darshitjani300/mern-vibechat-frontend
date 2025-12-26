import { useEffect } from "react";
import { homeApi } from "../../api/homeApi";
import { toastMessage } from "../../utils/toastMessage";
import styles from "./home.module.scss";
import Chat from "../Chat/Chat";
import Message from "../Chat/components/messages/Message";
import { useAppDispatch, useAppSelector } from "../../types/reduxHooks";
import PlaceholderMessage from "../Chat/components/messages/placeholder/PlaceholderMessage";
import { getProfileApi } from "../../api/profile";
import { userProfile } from "../../redux/features/chat/chat.slice";

const Home = () => {
  const userSelected = useAppSelector((state) => state.userSlice.value);
  const dispatch = useAppDispatch();

  const getHomeData = async () => {
    try {
      await homeApi();
    } catch (error: any) {
      toastMessage("error", error.response.data.message);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await getProfileApi();
      const profile = res.data.profile;

      if (!profile) {
        return;
      }

      dispatch(userProfile(profile));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getHomeData();
    fetchProfile();
  }, []);

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
