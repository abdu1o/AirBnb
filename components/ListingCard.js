import Image from 'next/image';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function ListingCard({ id, imageUrl, title, dates, price, rating, location }) {
  return (
    <div className={styles.listingCard}>
      <div className={styles.imageWrapper}>
        <Link href={`/property/${id}`}>
          <Image
            src={imageUrl}
            fill
            className={styles.img}
            alt={title}
          />
        </Link>
      </div>
      <div className={styles.info}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.meta}>{location} · {dates}</p>
        <div className={styles.details}>
          <span className={styles.price}>${price}/ніч</span>
          <div className={styles.rating}>
            ⭐ {rating.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
}