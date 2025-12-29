import { useEffect, useRef, useState } from "react";
import NavIcon from "../../../../components/icons/NavIcon";
import { useAppDispatch, useAppSelector } from "../../../../types/reduxHooks";
import styles from "./message.module.scss";
import { socket } from "../../../../socket/socket";
import { closeChatVal } from "../../../../redux/features/open/openChat.slice";

const Message = () => {
  const userProfile = useAppSelector((state) => state.userSlice.profile);
  const [input, setInput] = useState<string>("");
  const messages = useAppSelector((state) => state.userSlice.messages);
  const userData = useAppSelector((state) => state.userSlice.userProfile);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const openMobileChat = useAppSelector((state) => state.chatSlice.open);
  const dispatch = useAppDispatch();

  const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input || !userProfile.userId) return;

    socket.emit("private_message", {
      to: userProfile.userId,
      text: input,
    });

    setInput("");
  };

  const handleBack = () => {
    dispatch(closeChatVal());
  };

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollTop = chatEndRef.current.scrollHeight;
    }
  }, [messages]);

  console.log("Messages: ", messages);

  return (
    <div
      className={`${styles.messageWrapper} ${
        openMobileChat ? styles.msgMobile : styles.noMessage
      } `}
    >
      <div className={styles.headerSection}>
        <div className={styles.container}>
          <button onClick={handleBack}>
            <NavIcon name="IoArrowBackOutline" size={22} />
          </button>

          <div className={styles.imageContainer}>
            <img
              src={`${userProfile?.picture?.url || "person.png"}`}
              alt="Icon"
              className={styles.image}
            />
          </div>

          <h4 className={styles.name}>{userProfile.name}</h4>
        </div>

        <div className={styles.rightSide}>
          <NavIcon name="IoIosSearch" />
        </div>
      </div>

      <div className={styles.chatSection} ref={chatEndRef}>
        {messages?.map((msg) => {
          const isMe = msg.sender === userData?.userId;

          return (
            <div
              key={msg._id}
              className={`${styles.messageRow} ${
                isMe ? styles.myMessage : styles.theirMessage
              }`}
            >
              <div className={styles.messageBubble}>
                {msg.text}
                <span className={styles.time}>
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.conversationSection}>
        <form className={styles.container} onSubmit={(e) => sendMessage(e)}>
          <div className={styles.attachment}>
            <NavIcon name="IoAdd" />
          </div>

          <div className={styles.input}>
            <input
              type="text"
              placeholder="Type a message"
              className={styles.input}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={999}
            />
          </div>

          <button className={styles.speech} type="submit">
            <NavIcon name="IoSend" size={22} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Message;
