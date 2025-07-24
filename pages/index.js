import Header from '../components/Header';
import CategoryChips from '../components/CategoryChips';
import FilterControls from '../components/FilterControls';
import ListingGrid from '../components/ListingGrid';
import MapToggleButton from '../components/MapToggleButton';
import Additional from '../components/Additional';
import AppendData from '../components/AppendData';
import Footer from '../components/Footer';
import { getListings } from '../lib/db';
import styles from '../styles/Home.module.css';


export default function Home({ listings }) {
  const handleAppendClick = () => {
    // Підвантажити додаткові дані
    console.log('Показати більше...');
  };
  return (
    <>
      <Header />
      <FilterControls />
      <CategoryChips />
      
      {/* <MapToggleButton /> */}
      <ListingGrid data={listings} />
      <AppendData onClick={handleAppendClick} />
      <Additional />
      <Footer />
    </>
  );
}

// Fetch data server-side for DB integration
export async function getServerSideProps() {
  const listings = await getListings();
  return { props: { listings } };
}