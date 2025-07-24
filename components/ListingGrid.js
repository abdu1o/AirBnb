import ListingCard from './ListingCard';
import styles from '../styles/Home.module.css';

export default function ListingGrid({ data }) {
  return (
    <div className={styles.listingGrid}>
      {data.map(item => (
        <ListingCard key={item.id} {...item} />
      ))}
    </div>
  );
}