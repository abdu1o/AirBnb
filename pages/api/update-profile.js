import clientPromise from "../../lib/mongodb";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: `Метод ${req.method} не дозволений` });
  }

  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "Не авторизовано" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const client = await clientPromise;
    const db = client.db("airbnb");

    const { email, phone } = req.body;

    if (!email || !phone) {
      return res.status(400).json({ error: "Потрібно передати email і телефон" });
    }

    const updateResult = await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      { $set: { email, phone } }
    );

    if (updateResult.modifiedCount === 0) {
      return res.status(400).json({ error: "Дані не оновлено" });
    }

    const updatedUser = await db.collection("users").findOne({ _id: new ObjectId(userId) });

    res.status(200).json({ user: updatedUser, message: "Профіль оновлено!" });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ error: "Помилка сервера при оновленні профілю" });
  }
}
