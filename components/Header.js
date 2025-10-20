import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import styles from '../styles/Home.module.css';

// Импортируй свои модалы — путь может отличаться
import { RegisterModal, LoginModal } from '../components/LoginModal';

export default function Header() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // auth state — по умолчанию false
  const [isLogged, setIsLogged] = useState(false);

  // control modals
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

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

  // handlers for auth-required actions
  const handleOfferClick = () => {
    if (!isLogged) {
      setShowRegister(true); // если не залогинен — открыть реєстрацію
      return;
    }
    // если залогинен — переход на страницу предложения (можно заменить на Link)
    window.location.href = '/offer';
  };

  const handleProfileClick = (e) => {
    if (!isLogged) {
      e.preventDefault && e.preventDefault();
      setShowRegister(true);
      return;
    }
    // при isLogged === true — обычный переход по Link будет срабатывать
  };

  return (
    <>
      <header className={styles.header} ref={menuRef}>
        <Link href="/" className={styles.logo}>
          AirBNB
        </Link>

        {/* Desktop nav (hidden on small screens) */}
        <nav className={styles.nav}>
          <Link href="/">Варіанти помешкань</Link>
          <Link href="/">Враження</Link>
          <Link href="/">Онлайн-враження</Link>
        </nav>

        <div className={styles.actions}>
          {/* Если залогинен — можно перейти, иначе открыть модал */}
          <button className={styles.offer} onClick={handleOfferClick}>
            Запропонувати житло
          </button>

          {/* Burger button (visible on small screens) */}
          <button
            className={styles.burger}
            aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={open}
            onClick={() => setOpen((s) => !s)}
          >
            {open ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M3 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </button>

          {/* Профиль: если залогинен — обычный Link, иначе кнопка открывающая модал */}
          {isLogged ? (
            <Link href="/profile" className={styles.profileLink}>
              <img src="/icons/user.svg" alt="user" />
            </Link>
          ) : (
            <button className={styles.profileLink} onClick={handleProfileClick} aria-label="Открыть авторизацию">
              <img src="/icons/user.svg" alt="user" />
            </button>
          )}
        </div>

        {/* Mobile menu (slides down) */}
        <div className={`${styles.mobileNav} ${open ? styles.open : ''}`} role="menu">
          <Link href="/" className={styles.mobileLink} onClick={() => setOpen(false)}>Варіанти помешкань</Link>
          <Link href="/" className={styles.mobileLink} onClick={() => setOpen(false)}>Враження</Link>
          <Link href="/" className={styles.mobileLink} onClick={() => setOpen(false)}>Онлайн-враження</Link>

          {/* Mobile offer: если не залогинен — открыть модал */}
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

      {/* Modals */}
      <RegisterModal
        isOpen={showRegister}
        onClose={() => setShowRegister(false)}
        onOpenLogin={() => { setShowRegister(false); setShowLogin(true); }}
      />

      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onLogin={(info) => {
          console.log('Logged in from header:', info);
          setIsLogged(true);
          setShowLogin(false);
        }}
      />
    </>
  );
}
