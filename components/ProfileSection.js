import { useRef, useEffect, useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import styles from '../styles/Profile.module.css';

export default function ProfileSection() {
  const textareaRef = useRef(null);
  const [description, setDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/me', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          const userDesc = data?.user?.description || '';
          setDescription(userDesc);
        } else {
          console.warn('Не удалось получить данные пользователя');
        }
      } catch (err) {
        console.error('Помилка отримання користувача:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    const resize = () => {
      ta.style.height = 'auto';
      ta.style.height = `${ta.scrollHeight}px`;
    };
    resize();
    ta.addEventListener('input', resize);
    return () => ta.removeEventListener('input', resize);
  }, [description]);

  const handleSave = async () => {

    setIsSaving(true);
    try {
      const res = await fetch('/api/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description }),
        credentials: 'include',
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data?.error || 'Помилка при збереженні опису');
      } else {
        toast.success('Опис успішно оновлено!');
      }
    } catch (err) {
      console.error('Помилка зʼєднання з сервером:', err);
      toast.error('Помилка зʼєднання з сервером');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <section className={styles.infoSection}>
        <Toaster position="top-right" />
        <h2 className={styles.sectionTitle}>Інформація про вас</h2>
        <p>Завантаження...</p>
      </section>
    );
  }

  return (
    <section className={styles.infoSection}>
      <Toaster position="top-right" />
      <h2 className={styles.sectionTitle}>Інформація про вас</h2>
      <textarea
        style={{paddingLeft: 5}}
        ref={textareaRef}
        className={styles.textarea}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Напишіть щось веселе й неординарне."
        maxLength={300}
      />
      <div style={{ textAlign: 'right', fontSize: 12, color: '#777' }}>
        {description.length}/300
      </div>
      <button
        className={styles.linkButton}
        onClick={handleSave}
        disabled={isSaving}
        style={{ opacity: isSaving ? 0.6 : 1 }}
      >
        {isSaving ? 'Збереження...' : 'Додати вступ'}
      </button>
    </section>
  );
}
