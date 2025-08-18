import clientPromise from "./mongodb";
import monthMap from "./utils/consts";

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

export async function getListings(skip = 0, limit = 10) {
  const client = await clientPromise;
  const db = client.db('airbnb');

  const listings = await db
    .collection('listings')
    .find()
    .skip(skip)
    .limit(limit)
    .toArray();

  return listings.map(listing => ({
    id: listing._id,
    imageUrl: listing.imageUrl,
    title: listing.title,
    dates: formatDateRange(listing.dateFrom, listing.dateTo),
    price: listing.price,
    rating: listing.rating,
    location: listing.location
  }));
}
