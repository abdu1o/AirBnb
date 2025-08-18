import clientPromise from "../../lib/mongodb";
import { getListings } from "../../lib/listings";

export default async function handler(req, res) {
  const { skip = 0, limit = 10 } = req.query;
  const listings = await getListings(Number(skip), Number(limit));
  res.status(200).json(listings);
}
