import clientPromise from '../../lib/mongodb';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ user: null });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const client = await clientPromise;
    const db = client.db('airbnb');

    const user = await db.collection('users').findOne(
      { _id: new ObjectId(userId) },
      { projection: { password: 0 } }
    );

    if (!user) {
      return res.status(404).json({ user: null, error: 'Користувача не знайдено' });
    }

    return res.status(200).json({ user });
  } catch (err) {
    console.error('Помилка при отриманні користувача:', err);
    return res.status(401).json({ user: null, error: 'Невірний токен або користувач не знайдений' });
  }
}
