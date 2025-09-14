import clientPromise from "./mongodb";
import { ObjectId } from "mongodb";

const client = await clientPromise;
const db = client.db("airbnb");

export async function getReviewsCount(listingId) {
  try {
    const objectId = new ObjectId(listingId);

    const count = await db
      .collection("reviews")
      .countDocuments({ listingId: objectId });

    return count;
  } catch (err) {
    console.error("Invalid listingId:", listingId, err);
    return 0;
  }
}

export async function getReviews(listingId) {
  try {
    const client = await clientPromise;
    const db = client.db("airbnb");

    const objectId = new ObjectId(listingId);

    const reviews = await db.collection("reviews").aggregate([
      {
        $match: { listingId: objectId }
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 1,
          rating: 1,
          comment: 1,
          user: {
            _id: "$user._id",
            name: "$user.name",
            avatarUrl: "$user.avatarUrl"
          }
        }
      }
    ]).toArray();

    return reviews.map((r) => ({
      id: r._id.toString(),
      rating: r.rating,
      comment: r.comment,
      user: {
        id: r.user._id.toString(),
        name: r.user.name,
        avatarUrl: r.user.avatarUrl,
      }
    }));
  } catch (err) {
    console.error("Error fetching reviews with users for listing:", listingId, err);
    return [];
  }
}