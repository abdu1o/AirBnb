import styles from '../styles/Profile.module.css';
import { FiPlus } from 'react-icons/fi';

export default function ProfileInterests() {
  return (
    <section className={styles.interestsSection}>
      <h2 className={styles.sectionTitle}>Що ви найбільше любите?</h2>
      <p className={styles.sectionDesc}>Спілкуйтеся на грунті спільних зацікавлень...</p>
      <div className={styles.interestsList}>
        {[1,2,3].map(i => (
          <button key={i} className={styles.interestButton}>
            <FiPlus />
          </button>
        ))}
      </div>
    </section>
  );
}