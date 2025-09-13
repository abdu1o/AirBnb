import clientPromise from "./mongodb";

const client = await clientPromise;
const db = client.db("airbnb");

export async function getReviews(listingId) {

  const reviews = await db.collection("reviews").aggregate([
    {
      $match: {
        listingId: listingId
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user"
      }
    },
    {
      $unwind: "$user"
    },
    {
      $project: {
        _id: 0,
        userName: "$user.name",
        userAvatar: "$user.avatarUrl",
        comment: 1,
        rating: 1,
        listingId: 1
      }
    }
  ]).toArray();

  return reviews;
}

export async function getReviewsCount(listingId) {

  let objectId;
  try {
    objectId = new ObjectId(listingId);
  } catch {
    return 0;
  }

  const count = await db
    .collection("reviews")
    .countDocuments({ listingId: objectId });

  return count;
}
