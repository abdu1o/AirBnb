import styles from '../styles/Profile.module.css';

export default function ProfileHeader() {
  return (
    <div className={styles.profileHeader}>
      <div className={styles.avatarWrapper}>
        <div className={styles.avatar}>I</div>
        <button className={styles.avatarButton}>Додати</button>
      </div>
      <h1 className={styles.title}>Ваш профіль</h1>
      <p className={styles.description}>
        Інформацію, яку ви надаєте, буде використано на AirBNB... <a className={styles.link}>Докладніше</a>
      </p>
    </div>
  );
}