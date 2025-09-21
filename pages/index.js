import { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import CategoryChips from '../components/CategoryChips';
import FilterControls from '../components/FilterControls';
import ListingGrid from '../components/ListingGrid';
import AppendData from '../components/AppendData';
import Additional from '../components/Additional';
import Footer from '../components/Footer';
import { getListings } from '../lib/listings';

export default function Home({ initialListings }) {
  const [listings, setListings] = useState(initialListings);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialListings.length === 10);
  const [categoriesSelected, setCategoriesSelected] = useState([]);

  const reloadListings = useCallback(async () => {
    const res = await fetch(`/api/listings?skip=0&limit=10`);
    const freshListings = await res.json();
    setListings(freshListings);
    setHasMore(freshListings.length === 10);
    setPage(1);
  }, []);

  const handleAppendClick = async () => {
    const res = await fetch(`/api/listings?skip=${page * 10}&limit=10`);
    const newListings = await res.json();

    setListings(prev => [...prev, ...newListings]);
    setPage(prev => prev + 1);

    if (newListings.length < 10) {
      setHasMore(false);
    }
  };

  return (
    <>
      <Header />
      <FilterControls
        categoriesSelected={categoriesSelected}
        setCategoriesSelected={setCategoriesSelected}
        onFiltersChange={reloadListings}
      />
      <CategoryChips
        categoriesSelected={categoriesSelected}
        setCategoriesSelected={setCategoriesSelected}
        onFiltersChange={reloadListings}
      />
      <ListingGrid data={listings} />
      {hasMore && <AppendData onClick={handleAppendClick} />}
      <Additional />
      <Footer />
    </>
  );
}

export async function getServerSideProps() {
  const initialListings = await getListings(0, 10);
  return { props: { initialListings } };
}
