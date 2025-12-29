import styles from "./chat.module.scss";
import Conversation from "./components/conversation/Conversation";
import SelectFilter from "./components/filters/SelectFilter";
import ChatSearch from "./components/search/ChatSearch";
import { useAppSelector } from "../../types/reduxHooks";
import { Link } from "react-router-dom";
import NavIcon from "../../components/icons/NavIcon";
import { useState } from "react";
import LogoutConfirmation from "../../components/confirmation/LogoutConfirmation";

const Chat = () => {
  const openMobileChat = useAppSelector((state) => state.chatSlice.open);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLogout, setIsLogout] = useState(false);

  const toggleSideBar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <section
      className={`${styles.container} ${
        openMobileChat ? styles.msgWrapper : ""
      }`}
    >
      <div className={styles.headerContainer}>
        <h1>VibeChat</h1>

        <div className={styles.menuIcon}>
          <button onClick={toggleSideBar}>
            {isOpen ? (
              <NavIcon name="IoMdClose" />
            ) : (
              <NavIcon name="RxHamburgerMenu" />
            )}
          </button>
          {isOpen ? (
            <div className={styles.menuCont}>
              <div className={styles.menuItemCont}>
                <Link to={"/profile"} className={styles.menuItems}>
                  <NavIcon name="FaRegCircleUser" size={20} />
                  Profile
                </Link>
                <button
                  className={styles.menuItems}
                  onClick={() => {
                    setIsLogout(true);
                  }}
                >
                  <NavIcon name="IoMdLogOut" size={22} />
                  Logout
                </button>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
      <ChatSearch />
      <SelectFilter />
      <Conversation />
      {isLogout && <LogoutConfirmation onClose={() => setIsLogout(false)} />}
    </section>
  );
};

export default Chat;
