import { getListingById } from "../../lib/listings";
import { getUserById } from "../../lib/users";
import { getReviewsCount } from "../../lib/reviews";
import { getReviews } from "../../lib/reviews";
import Header from "../../components/Header";
import Property from "../../components/Property";
import PropertyFooter from "../../components/PropertyFooter";
import styles from "../../styles/Property.module.css";

export default function PropertyPage({ listing, user, reviewCount, reviews }) {

  return (
    <div className={styles.page}>
      <Header />
      <Property listing={listing} user={user} reviewCount={reviewCount}/>
      <PropertyFooter listing={listing} reviews={reviews}/>
    </div>
  );
}

export async function getServerSideProps({ params }) {
  const listing = await getListingById(params.id);
  if (!listing) {
    return { notFound: true };
  }

  let reviewCount = 0;
  let user = null;
  let reviews = [];

  if (listing?.hostId) {
    user = await getUserById(listing.hostId);
  }

  if (listing) {
    reviewCount = await getReviewsCount(params.id);
    reviews = await getReviews(params.id);
    
  }

  return {
    props: { listing, user, reviewCount, reviews },
  };
}
