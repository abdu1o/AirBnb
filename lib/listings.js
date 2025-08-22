import clientPromise from "./mongodb";
import monthMap from "./utils/consts";
import { getSearchState } from "./filtersStorage";

function formatDateRange(dateFrom, dateTo) {
  const from = new Date(dateFrom);
  const to = new Date(dateTo);

  const fromDay = from.getDate();
  const fromMonth = monthMap[String(from.getMonth() + 1).padStart(2, '0')];
  const toDay = to.getDate();
  const toMonth = monthMap[String(to.getMonth() + 1).padStart(2, '0')];

  if (fromMonth === toMonth) {
    return `${fromDay}–${toDay} ${fromMonth}`;
  }

  return `${fromDay} ${fromMonth} – ${toDay} ${toMonth}`;
}

function formatDate(isoDate) {
  const date = new Date(isoDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export async function getListings(skip = 0, limit = 10, filters = null) {
  const client = await clientPromise;
  const db = client.db("airbnb");

  const searchState = filters || (await getSearchState());

  const dateFrom = searchState?.dateRange ? formatDate(searchState.dateRange.start) : null;
  const dateTo = searchState?.dateRange ? formatDate(searchState.dateRange.end) : null;
  const where = searchState?.where?.label || null;
  const pets = searchState?.who?.pets || null;
  const children = searchState?.who?.children || null;
  const infants = searchState?.who?.infants || null;

  const query = {};

  if (dateFrom && dateTo) {
    query.dateFrom = { $lte: dateTo };
    query.dateTo = { $gte: dateFrom };
  }

  if (where) {
    query.title = { $regex: new RegExp(where, "i") };
  }

  if (pets != null && pets > 0) {
    query.petsAllowed = true;
  }

  if ((children != null && children > 0) || (infants != null && infants > 0)) {
    query.childrenAllowed = true;
  }

  const listings = await db
    .collection("listings")
    .find(query)
    .skip(skip)
    .limit(limit)
    .toArray();

  return listings.map((listing) => ({
    id: listing._id,
    imageUrl: listing.imageUrl,
    title: listing.title,
    dates: formatDateRange(listing.dateFrom, listing.dateTo),
    price: listing.price,
    rating: listing.rating,
    location: listing.location,
  }));
}
