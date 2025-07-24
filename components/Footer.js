import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerCols}>
        <div>
          <h4>Підтримка</h4>
          <ul>
            <li><Link href="#">Довідковий центр</Link></li>
            <li><Link href="#">AirCover</Link></li>
            <li><Link href="#">Протидія дискримінації</Link></li>
            <li><Link href="#">Підтримка людей з інвалідністю</Link></li>
            <li><Link href="#">Варіанти скасування бронювань</Link></li>
            <li><Link href="#">Надіслати скаргу від сусідів</Link></li>
          </ul>
        </div>
        <div>
          <h4>Прийом гостей</h4>
          <ul>
            <li><Link href="#">Перетворити помешкання на HomeFU</Link></li>
            <li><Link href="#">AirCover для господарів</Link></li>
            <li><Link href="#">Ресурси про прийом гостей</Link></li>
            <li><Link href="#">Форум спільноти</Link></li>
            <li><Link href="#">Відповідальний прийом гостей</Link></li>
          </ul>
        </div>
        <div>
          <h4>HomeFU</h4>
          <ul>
            <li><Link href="#">Новини</Link></li>
            <li><Link href="#">Нові функції</Link></li>
            <li><Link href="#">Вакансії</Link></li>
            <li><Link href="#">Інвестори</Link></li>
            <li><Link href="#">Тимчасове житло від HomeFU</Link></li>
          </ul>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <span>2025 AirBNB, Inc.</span>
        <nav className={styles.footerNav}>  
          <Link href="#">Конфіденційність</Link>
          <Link href="#">Умови</Link>
          <Link href="#">Мапа сайту</Link>
        </nav>
        <div className={styles.footerSocial}>
          <Link href="#">Українська (UA)</Link>
          <Link href="#">$ USD</Link>
          <Link href="#">🐦</Link>
          <Link href="#">📘</Link>
        </div>
      </div>
    </footer>
  );
}