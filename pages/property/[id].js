import { useRouter } from "next/router";
import Header from "../../components/Header";
import Property from "../../components/Property";
import PropertyFooter from "../../components/PropertyFooter";
import styles from "../../styles/Property.module.css";
import { getListingById } from "../../lib/listings";

export default function PropertyPage({ listing }) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  if (!listing) {
    return <div>Not found</div>;
  }

  return (
    <div className={styles.page}>
      <Header />
      <Property listing={listing} />
      <PropertyFooter />
    </div>
  );
}

export async function getServerSideProps({ params }) {
  const listing = await getListingById(params.id);
  return {
    props: { listing },
  };
}
