import { useState } from "react";
import styles from "../styles/Property.module.css";

export default function PropertyFooter() {
  const [activeTab, setActiveTab] = useState("amenities");

  const renderContent = () => {
    switch (activeTab) {
      case "amenities":
        return <div className={styles.content}>Тут будуть Зручності</div>;
      case "reviews":
        return <div className={styles.content}>Тут будуть Відгуки</div>;
      case "location":
        return <div className={styles.content}>Тут буде Розташування</div>;
      default:
        return null;
    }
  };

  return (
    <div className={styles.footerWrapper}>
      <div className={styles.tabs}>
        <button
          className={activeTab === "amenities" ? styles.active : ""}
          onClick={() => setActiveTab("amenities")}
        >
          Зручності
        </button>
        <button
          className={activeTab === "reviews" ? styles.active : ""}
          onClick={() => setActiveTab("reviews")}
        >
          Відгуки
        </button>
        <button
          className={activeTab === "location" ? styles.active : ""}
          onClick={() => setActiveTab("location")}
        >
          Розташування
        </button>
      </div>
      <div className={styles.contentWrapper}>{renderContent()}</div>
    </div>
  );
}
