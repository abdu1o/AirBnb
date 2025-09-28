import clientPromise from "./mongodb";
import monthMap from "./utils/consts";
import { ObjectId } from "mongodb";
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
  const categoryNames = searchState?.categories || [];

  const query = {};

  if (dateFrom && dateTo) {
    query.dateFrom = { $lte: dateTo };
    query.dateTo = { $gte: dateFrom };
  }

  if (where) {
    query.title = { $regex: new RegExp(where, "i") };
  }

  if (pets != null && pets > 0) query.petsAllowed = true;
  if ((children != null && children > 0) || (infants != null && infants > 0)) query.childrenAllowed = true;

  // --- Получаем _id категорий по имени ---
  let categoryIds = [];
  if (categoryNames.length > 0) {
    const categories = await db
      .collection("categories")
      .find({ name: { $in: categoryNames } })
      .toArray();
    categoryIds = categories.map(c => c._id);
    query.categories = { $in: categoryIds };
  }

  const listings = await db
    .collection("listings")
    .aggregate([
      { $match: query },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "categories",
          localField: "categories",
          foreignField: "_id",
          as: "categories"
        }
      },
      {
        $lookup: {
          from: "reviews",
          let: { listingId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$listingId", "$$listingId"] } } },
            { $group: { _id: null, avgRating: { $avg: "$rating" } } }
          ],
          as: "ratingData"
        }
      },
      {
        $addFields: {
          averageRating: {
            $ifNull: [{ $arrayElemAt: ["$ratingData.avgRating", 0] }, 0]
          }
        }
      },
      { $project: { ratingData: 0 } } // скрываем временное поле
    ])
    .toArray();

  return listings.map((listing) => ({
    id: listing._id.toString(),
    title: listing.title,
    location: listing.location,
    imageUrl: listing.imageUrl,
    price: listing.price,
    rating: listing.averageRating, // <-- уже динамически
    dateFrom: listing.dateFrom,
    dateTo: listing.dateTo,
    dates: formatDateRange(listing.dateFrom, listing.dateTo),
    hostId: listing.hostId.toString(),
    childrenAllowed: listing.childrenAllowed,
    petsAllowed: listing.petsAllowed,
    description: listing.description,
    details: listing.details,
    amenities: listing.amenities,
    lat: listing.lat || null,
    lng: listing.lng || null,
    exactAddress: listing.exactAddress || null,
    categories: listing.categories.map(c => ({
      id: c._id.toString(),
      name: c.name
    }))
  }));
}

export async function getListingById(id) {
  const client = await clientPromise;
  const db = client.db("airbnb");

  let objectId;
  try {
    objectId = new ObjectId(id);
  } catch {
    return null;
  }

  const listing = await db.collection("listings").aggregate([
    { $match: { _id: objectId } },
    {
      $lookup: {
        from: "categories",
        localField: "categories",
        foreignField: "_id",
        as: "categories"
      }
    }
  ]).next();

  if (!listing) return null;

  return {
    id: listing._id.toString(),
    title: listing.title,
    location: listing.location,
    imageUrl: listing.imageUrl,
    price: listing.price,
    rating: listing.rating,
    dateFrom: listing.dateFrom,
    dateTo: listing.dateTo,
    dates: formatDateRange(listing.dateFrom, listing.dateTo),
    hostId: listing.hostId.toString(),
    childrenAllowed: listing.childrenAllowed,
    petsAllowed: listing.petsAllowed,
    description: listing.description,
    details: listing.details,
    amenities: listing.amenities,
    lat: listing.lat || null,
    lng: listing.lng || null,
    exactAddress: listing.exactAddress || null,
    categories: listing.categories.map((c) => ({
      id: c._id.toString(),
      name: c.name
    }))
  };
}
