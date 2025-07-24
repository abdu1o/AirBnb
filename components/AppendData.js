import styles from '../styles/Home.module.css';

export default function AppendData({ onClick }) {
  return (
    <div className={styles.appendWrapper}>
      <button className={styles.appendButton} onClick={onClick}>
        Показати більше
      </button>
    </div>
  );
}