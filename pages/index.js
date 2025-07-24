import Header from '../components/Header';
import CategoryChips from '../components/CategoryChips';
import FilterControls from '../components/FilterControls';
import ListingGrid from '../components/ListingGrid';
import MapToggleButton from '../components/MapToggleButton';
import { getListings } from '../lib/db';
import styles from '../styles/Home.module.css';


export default function Home({ listings }) {
  return (
    <>
      <Header />
      <FilterControls />
      <CategoryChips />
      
      {/* <MapToggleButton /> */}
      <ListingGrid data={listings} />
    </>
  );
}

// Fetch data server-side for DB integration
export async function getServerSideProps() {
  const listings = await getListings();
  return { props: { listings } };
}