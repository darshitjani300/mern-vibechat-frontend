import NavIcon from "../icons/NavIcon";
import styles from "./navmenu.module.scss";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../types/reduxHooks";
import LogoutConfirmation from "../confirmation/LogoutConfirmation";
import { useState } from "react";

type NavIconType = {
  id: number;
  name: string;
  activeName?: string;
  text: string;
  size: number;
  path?: string;
  url?: string;
};

const NavMenu = () => {
  const navigate = useNavigate();
  const data = useAppSelector((state) => state.userSlice.userProfile);
  const location = useLocation();
  const [isLogout, setIsLogout] = useState(false);

  const icons: Array<NavIconType> = [
    {
      id: 1,
      name: "IoChatboxEllipsesOutline",
      activeName: "IoChatboxEllipses",
      text: "Chat",
      path: "/home",
      size: 28,
    },
    {
      id: 5,
      name: "FaRegCircleUser",
      activeName: "FaRegCircleUser",
      text: "Profile",
      size: 28,
      path: "/profile",
      url: data.picture?.url || "",
    },
    {
      id: 3,
      name: "IoMdLogOut",
      text: "Logout",
      size: 28,
    },
  ];

  const upperIcon = icons.splice(0, 2);
  const lowerIcon = icons;

  return (
    <div className={styles.container}>
      <div className={styles.containerWrapper}>
        <div className={styles.iconContainer}>
          <ul className={styles.upperContainer}>
            {upperIcon &&
              upperIcon?.map((elem) => {
                const isActive = location.pathname === elem?.path;
                const notPublic = elem?.url === "person.png";

                return (
                  <li
                    key={elem?.id}
                    className={`${styles.icon} ${
                      isActive ? styles.activeIcon : ""
                    }`}
                    onClick={() => {
                      navigate(elem?.path || "/");
                    }}
                  >
                    {elem?.url && elem?.url !== "" ? (
                      <img
                        src={elem?.url}
                        alt="photo"
                        className={`${styles.profilePhoto} ${
                          isActive && !notPublic ? styles.activePhoto : ""
                        }`}
                      />
                    ) : (
                      <NavIcon
                        className={
                          isActive ? styles.iconStyleActive : styles.iconStyle
                        }
                        name={(isActive ? elem?.activeName : elem?.name) ?? ""}
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

          <ul className={styles.lowerContainer}>
            {lowerIcon &&
              lowerIcon?.map((elem) => {
                return (
                  <li
                    key={elem?.id}
                    className={`${styles.icon}`}
                    onClick={() => {
                      setIsLogout(true);
                    }}
                  >
                    <NavIcon name={elem?.name} size={elem?.size} />

                    <span className={`${styles.text} `}>{elem?.text}</span>
                  </li>
                );
              })}
          </ul>
        </div>
      </div>

      {isLogout && <LogoutConfirmation onClose={() => setIsLogout(false)} />}
    </div>
  );
};

export default NavMenu;
