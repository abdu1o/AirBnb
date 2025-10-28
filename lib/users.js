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

export async function createUser(userData) {
  const client = await clientPromise;
  const db = client.db("airbnb");

  if (!userData || typeof userData !== "object") {
    throw new Error("userData має бути об’єктом");
  }

  if (userData.email) {
    const existingUser = await db.collection("users").findOne({ email: userData.email });
    if (existingUser) {
      return {
        success: false,
        message: "Користувач з таким email вже існує",
        user: {
          id: existingUser._id.toString(),
          ...existingUser,
        },
      };
    }
  }

  const newUser = {
    ...userData,
    createdAt: userData.createdAt || new Date(),
  };

  const result = await db.collection("users").insertOne(newUser);

  return {
    success: true,
    user: {
      id: result.insertedId.toString(),
      ...newUser,
    },
  };
}
