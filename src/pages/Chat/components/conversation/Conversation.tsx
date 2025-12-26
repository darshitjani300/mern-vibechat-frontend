import { useEffect, useState } from "react";
import { getAllProfileApi } from "../../../../api/profile";
import NavIcon from "../../../../components/icons/NavIcon";
import styles from "./conversation.module.scss";
import { useAppDispatch, useAppSelector } from "../../../../types/reduxHooks";
import {
  addMessage,
  setMessages,
  storeProfile,
  userSetid,
} from "../../../../redux/features/chat/chat.slice";
import { socket } from "../../../../socket/socket";
import { getMessagesApi } from "../../../../api/messages";
import { openChatVal } from "../../../../redux/features/open/openChat.slice";

const Conversation = () => {
  const dispatch = useAppDispatch();
  const [data, setData] = useState<
    Array<{
      picture: string;
      name: string;
      about: string;
      userId: string;
      _id: string;
    }>
  >([]);
  const userData = useAppSelector((state) => state.userSlice.userProfile);

  const handleProfile = async () => {
    const res = await getAllProfileApi();
    setData(res.data.profile);
  };

  const handleReduxStore = async (
    id: string,
    item: {
      picture: string;
      name: string;
      about: string;
      userId: string;
      _id: string;
    }
  ) => {
    dispatch(userSetid(id));
    dispatch(storeProfile(item));
    dispatch(openChatVal(true));

    try {
      const res = await getMessagesApi(id);
      dispatch(setMessages(res.messages));
    } catch (error) {
      console.log(error);
    }
  };

  const filterData = data?.filter((item) => item.userId != userData?.userId);

  useEffect(() => {
    handleProfile();
  }, []);

  useEffect(() => {
    if (!userData?.userId) return;

    socket.emit("register", userData?.userId);

    socket.on("privateMessage", (msg) => {
      dispatch(addMessage(msg));
    });

    return () => {
      socket.off("private_message");
    };
  }, [userData?.userId]);

  return (
    <div
      className={styles.conversationWrapper}
    >
      <div className={styles.containerWrapper}>
        {filterData.map((item) => (
          <div
            className={styles.container}
            key={item.userId}
            onClick={() => handleReduxStore(item.userId, item)}
          >
            <div className={styles.imageContainer}>
              <img
                src={`http://localhost:8001${item.picture}`}
                alt="Icon"
                className={styles.image}
              />
            </div>

            <div className={styles.wrapperContainer}>
              <div className={styles.upperContainer}>
                <h4 className={styles.name}>{item.name}</h4>
              </div>
              <div className={styles.lowerContainer}>
                <p className={styles.chat}>{item.about}</p>
                <NavIcon
                  name="TbPinnedFilled"
                  className={styles.pinIcon}
                  size={22}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Conversation;
