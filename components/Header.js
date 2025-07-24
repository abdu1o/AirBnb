import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logo}>
        AirBNB
      </Link>
      <nav className={styles.nav}>
        <Link href="/">Варіанти помешкань</Link>
        <Link href="/">Враження</Link>
        <Link href="/">Онлайн-враження</Link>
      </nav>
      <div className={styles.actions}>
        <button>Запропонувати житло</button>
        <button><img src="/icons/menu.svg" alt="menu"/></button>
        <button><img src="/icons/user.svg" alt="user"/></button>
      </div>
    </header>
  );
}