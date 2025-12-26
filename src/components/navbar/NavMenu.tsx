import { useState } from "react";
import NavIcon from "../icons/NavIcon";
import styles from "./navmenu.module.scss";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../types/reduxHooks";

type NavIconType = {
  id: number;
  name: string;
  activeName: string;
  text: string;
  size?: number;
  path?: string;
  url?: string;
};

const NavMenu = () => {
  const [active, setActive] = useState<number>(1);
  const navigate = useNavigate();
  const data = useAppSelector((state) => state.userSlice.userProfile);

  const icons: Array<NavIconType> = [
    {
      id: 1,
      name: "IoChatboxEllipsesOutline",
      activeName: "IoChatboxEllipses",
      text: "Chat",
      path: "/home",
    },

    {
      id: 5,
      name: "LuBotOff",
      activeName: "LuBot",
      text: "Profile",
      size: 28,
      path: "/profile",
      url: data.picture?.url || "",
    },
  ];

  const upperIcons = icons?.splice(0, 1);
  const lowerIcons = icons;

  return (
    <div className={styles.container}>
      <div className={styles.containerWrapper}>
        <div className={styles.iconContainer}>
          <ul className={styles.upperContainer}>
            {upperIcons &&
              upperIcons?.map((elem: NavIconType) => {
                const isActive = elem?.id === active;

                return (
                  <li
                    key={elem?.id}
                    className={`${styles.icon} ${
                      isActive ? styles.activeIcon : ""
                    }`}
                    onClick={() => {
                      setActive(elem?.id);
                      navigate(elem?.path || "/");
                    }}
                  >
                    <NavIcon
                      name={isActive ? elem?.activeName : elem?.name}
                      size={elem?.size}
                      className={
                        isActive ? styles.iconStyleActive : styles.iconStyle
                      }
                    />
                    <span
                      className={`${styles.text} ${
                        isActive ? styles.activeText : ""
                      } `}
                    >
                      {elem?.text}
                    </span>
                  </li>
                );
              })}
          </ul>

          <ul className={styles.lowerContainer}>
            {lowerIcons &&
              lowerIcons?.map((elem) => {
                const isActive = elem?.id === active;

                return (
                  <li
                    key={elem?.id}
                    className={`${styles.icon} ${
                      isActive ? styles.activeIcon : ""
                    }`}
                    onClick={() => {
                      setActive(elem?.id);
                      navigate(elem?.path || "/");
                    }}
                  >
                    {elem?.url ? (
                      <img
                        src={elem?.url}
                        alt="photo"
                        className={styles.profilePhoto}
                      />
                    ) : (
                      <NavIcon
                        className={
                          isActive ? styles.iconStyleActive : styles.iconStyle
                        }
                        name={isActive ? elem?.activeName : elem?.name}
                        size={elem?.size}
                      />
                    )}

                    <span
                      className={`${styles.text} ${
                        isActive ? styles.activeText : ""
                      } `}
                    >
                      {elem?.text}
                    </span>
                  </li>
                );
              })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NavMenu;
