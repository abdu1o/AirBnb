import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import styles from '../styles/Home.module.css';
import { RegisterModal, LoginModal } from '../components/LoginModal';
import { Toaster, toast } from 'react-hot-toast';

export default function Header() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState(null);

  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/me');
        if (res.ok) {
          const data = await res.json();
          if (data?.user) {
            setIsLogged(true);
            setUser(data.user);
          } else {
            setIsLogged(false);
          }
        } else {
          setIsLogged(false);
        }
      } catch (err) {
        console.error('Помилка перевірки авторизації:', err);
        setIsLogged(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    function onClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('keydown', onKey);
    document.addEventListener('click', onClickOutside);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('click', onClickOutside);
    };
  }, []);

  const handleOfferClick = () => {
    if (!isLogged) {
      setShowRegister(true);
      return;
    }
    window.location.href = '/offer';
  };

  const handleProfileClick = (e) => {
    if (!isLogged) {
      e.preventDefault && e.preventDefault();
      setShowRegister(true);
      return;
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
      toast.success('Ви вийшли з акаунту');
      setIsLogged(false);
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
      toast.error('Помилка при виході');
    }
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />

      <header className={styles.header} ref={menuRef}>
        <Link href="/" className={styles.logo}>
          AirBNB
        </Link>

        <nav className={styles.nav}>
          <Link href="/">Варіанти помешкань</Link>
          <Link href="/">Враження</Link>
          <Link href="/">Онлайн-враження</Link>
        </nav>

        <div className={styles.actions}>
          <button className={styles.offer} onClick={handleOfferClick}>
            Запропонувати житло
          </button>

          <button
            className={styles.burger}
            aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={open}
            onClick={() => setOpen((s) => !s)}
          >
            {open ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M3 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </button>

          {/* 👇 Проверка залогиненности */}
          {isLogged ? (
            <div className={styles.userMenu}>
              <Link href="/profile" className={styles.profileLink}>
                <img src="/icons/user.svg" alt="user" />
              </Link>
            </div>
          ) : (
            <button
              className={styles.profileLink}
              onClick={handleProfileClick}
              aria-label="Открыть авторизацию"
            >
              <img src="/icons/user.svg" alt="user" />
            </button>
          )}
        </div>

        <div className={`${styles.mobileNav} ${open ? styles.open : ''}`} role="menu">
          <Link href="/" className={styles.mobileLink} onClick={() => setOpen(false)}>
            Варіанти помешкань
          </Link>
          <Link href="/" className={styles.mobileLink} onClick={() => setOpen(false)}>
            Враження
          </Link>
          <Link href="/" className={styles.mobileLink} onClick={() => setOpen(false)}>
            Онлайн-враження
          </Link>
          <button
            className={styles.mobileOffer}
            onClick={() => {
              setOpen(false);
              if (!isLogged) setShowRegister(true);
              else window.location.href = '/offer';
            }}
          >
            Запропонувати житло
          </button>
        </div>
      </header>

      {/* Модалки */}
      <RegisterModal
        isOpen={showRegister}
        onClose={() => setShowRegister(false)}
        onOpenLogin={() => {
          setShowRegister(false);
          setShowLogin(true);
        }}
      />

      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onLogin={(info) => {
          setIsLogged(true);
          setUser(info);
          setShowLogin(false);
          toast.success('Успішний вхід');
        }}
      />
    </>
  );
}
