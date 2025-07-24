import { useRef, useEffect } from 'react';
import styles from '../styles/Profile.module.css';

export default function ProfileSection() {
  const textareaRef = useRef(null);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    const resize = () => {
      ta.style.height = 'auto';
      ta.style.height = `${ta.scrollHeight}px`;
    };
    // initial resize
    resize();
    ta.addEventListener('input', resize);
    return () => ta.removeEventListener('input', resize);
  }, []);

  return (
    <section className={styles.infoSection}>
      <h2 className={styles.sectionTitle}>Інформація про вас</h2>
      <textarea
        ref={textareaRef}
        className={styles.textarea}
        placeholder="Напишіть щось веселе й неординарне."
      />
      <button className={styles.linkButton}>Додати вступ</button>
    </section>
  );
}