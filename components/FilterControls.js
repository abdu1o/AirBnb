import styles from '../styles/Home.module.css';
import { FiSearch } from 'react-icons/fi';

export default function FilterControls() {
  return (
    <div className={styles.filterWrapper}>
      <div className={styles.searchBox}>
        <input type="text" placeholder="Куди" className={styles.inputField} />
        <div className={styles.separator} />
        <input type="text" placeholder="Прибуття" className={styles.inputField} />
        <div className={styles.separator} />
        <input type="text" placeholder="Виїзд" className={styles.inputField} />
        <div className={styles.separator} />
        <input type="text" placeholder="Хто" className={styles.inputField} />
        <button className={styles.searchButton} aria-label="Search">
          <FiSearch size={20} />
        </button>
      </div>
    </div>
  );
}