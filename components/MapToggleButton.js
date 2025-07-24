import styles from '../styles/Home.module.css';
import { FiMap } from 'react-icons/fi';

export default function MapToggleButton() {
  return (
    <button className={styles.mapButton}>
      <FiMap size={16} />
      <span>Показати карту</span>
    </button>
  );
}