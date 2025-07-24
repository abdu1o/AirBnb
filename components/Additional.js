import Link from 'next/link';
import styles from '../styles/Home.module.css';

const categories = [
  { label: 'Популярні', href: '/?cat=popular' },
  { label: 'Мистецтво і культура', href: '/?cat=art' },
  { label: 'Відпочинок на відкритому повітрі', href: '/?cat=outdoor' },
  { label: 'Гори', href: '/?cat=mountains' },
  { label: 'Пляж', href: '/?cat=beach' },
  { label: 'Категорії', href: '/?cat=all' },
  { label: 'Чим зайнятися', href: '/?cat=activities' },
];

const items = [
  { title: 'Canmore', subtitle: 'Оренда квартир' },
  { title: 'Тусон', subtitle: 'Оренда кондомініумів' },
  { title: 'Анахайм', subtitle: 'Оренда помешкань для відпочинку' },
  /* ...інші елементи... */
  { title: 'Сонона', subtitle: 'Оренда помешкань для відпочинку' },
  { title: 'Показати більше', isMore: true },
];

export default function Additional() {
  return (
    <section className={styles.additionalSection}>
      <h2 className={styles.additionalTitle}>Ідеї для майбутніх поїздок</h2>
      <div className={styles.tabNav}>
        {categories.map(cat => (
          <Link key={cat.label} href={cat.href} className={styles.tabLink}>
            {cat.label}
          </Link>
        ))}
        {/* <div className={styles.tabUnderline} /> */}
      </div>
      <ul className={styles.suggestionList}>
        {items.map((it, i) => (
          <li key={i} className={it.isMore ? styles.moreItem : styles.suggestionItem}>
            {it.isMore
              ? <button className={styles.moreInline}>Показати більше</button>
              : <>
                  <strong>{it.title}</strong>
                  <span>{it.subtitle}</span>
                </>
            }
          </li>
        ))}
      </ul>
    </section>
  );
}