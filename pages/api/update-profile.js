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

    const { email, phone, description } = req.body;

    const updateFields = {};
    if (email) updateFields.email = email;
    if (phone) updateFields.phone = phone;
    if (description !== undefined) updateFields.description = description;

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ error: "Немає даних для оновлення" });
    }

    const updateResult = await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      { $set: updateFields }
    );

    if (updateResult.matchedCount === 0) {
      return res.status(404).json({ error: "Користувача не знайдено" });
    }

    const updatedUser = await db.collection("users").findOne({ _id: new ObjectId(userId) });

    res.status(200).json({ user: updatedUser, message: "Профіль оновлено!" });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ error: "Помилка сервера при оновленні профілю" });
  }
}
