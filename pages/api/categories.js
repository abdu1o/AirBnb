import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db("airbnb");

    const categories = await db.collection("categories").find({}).toArray();
    res.status(200).json(categories);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to load categories" });
  }
}
