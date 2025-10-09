// pages/order.js
import Header from '../components/Header';
import styles from '../styles/Order.module.css';
import OrderPage from '../components/OrderPage';

import { getListingById } from '../lib/listings';
import { getUserById } from '../lib/users';
import { getReviewsCount, getReviews } from '../lib/reviews';

export default function OrderRoute({ listing, user, reviewCount, reviews }) {
  // Если listing не передан, OrderPage всё равно отобразится, но без данных
  return (
    <div className={styles.page}>
      <Header />
        <OrderPage listing={listing} user={user} reviewCount={reviewCount} reviews={reviews} />
    </div>
  );
}

export async function getServerSideProps({ query }) {
  const id = query.property || query.id || null;
  if (!id) {
    // Можно сделать redirect на главную или вернуть пустые props
    return { props: {} };
  }

  const listing = await getListingById(id);
  if (!listing) {
    return { notFound: true };
  }

  let user = null;
  let reviewCount = 0;
  let reviews = [];

  if (listing.hostId) {
    user = await getUserById(listing.hostId);
  }

  reviewCount = await getReviewsCount(id);
  reviews = await getReviews(id);

  return {
    props: { listing, user, reviewCount, reviews },
  };
}
