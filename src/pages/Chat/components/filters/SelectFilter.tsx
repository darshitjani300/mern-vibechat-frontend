import { useState } from "react";
import styles from "./selectfilter.module.scss";

const SelectFilter = () => {
  const [activeItem, setActiveItem] = useState<number>(0);
  const filterItems = [
    { name: "All Chats", id: 0 },
    { name: "Unread", id: 1 }
  ];

  return (
    <div className={styles.filterContainer}>
      <ul>
        {filterItems.map((item) => {
          const isActive = item?.id === activeItem;
          return (
            <li
              key={item.id}
              onClick={() => setActiveItem(item.id)}
              className={`${styles.items} ${
                isActive ? styles.activeFilter : ""
              } `}
            >
              {item.name}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SelectFilter;
