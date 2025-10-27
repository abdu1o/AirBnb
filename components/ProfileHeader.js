import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Profile.module.css';
import { toast, Toaster } from 'react-hot-toast';

export default function ProfileHeader() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/me');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Помилка отримання користувача:', err);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/logout', {
        method: 'POST',
      });

      if (res.ok) {
        toast.success('Ви вийшли з акаунту');
        setUser(null);

        setTimeout(() => {
          router.push('/');
        }, 1000);
      } else {
        toast.error('Не вдалося вийти');
      }
    } catch (err) {
      console.error('Logout error:', err);
      toast.error('Помилка з’єднання з сервером');
    }
  };

  return (
    <div className={styles.profileHeader}>
      <Toaster position="top-right" />

      <div className={styles.avatarWrapper}>
        <div className={styles.avatar}>
          {user?.name ? user.name.charAt(0).toUpperCase() : 'I'}
        </div>
        <button className={styles.avatarButton}>Додати</button>
      </div>

      <h1 className={styles.title}>
        {user ? user.name : 'Ваш профіль'}
      </h1>

      <p className={styles.description}>
        <button
          onClick={handleLogout}
          className={styles.link}
          style={{
            border: 'none',
            background: 'transparent',
            color: '#ff385c',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Вийти
        </button>
      </p>
    </div>
  );
}
