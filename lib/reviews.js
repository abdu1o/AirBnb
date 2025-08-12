import clientPromise from "./mongodb";

export async function getReviews(listingId) {
  const client = await clientPromise;
  const db = client.db("airbnb");

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
