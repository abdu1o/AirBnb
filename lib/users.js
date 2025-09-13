import clientPromise from "./mongodb";
import { ObjectId } from "mongodb";

export async function getUserById(id) {
  const client = await clientPromise;
  const db = client.db("airbnb");

  let objectId;
  try {
    objectId = new ObjectId(id);
  } catch {
    return null;
  }

  const user = await db.collection("users").findOne({ _id: objectId });
  if (!user) return null;

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
  };
}
