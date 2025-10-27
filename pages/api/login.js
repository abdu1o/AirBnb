import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import clientPromise from '../../lib/mongodb';
import cookie from 'cookie';

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Метод не дозволений" });

  const { login, password } = req.body;
  const client = await clientPromise;
  const db = client.db("airbnb");

  const user = await db.collection("users").findOne({
    $or: [{ email: login }, { phone: login }],
  });

  if (!user) return res.status(404).json({ error: "Користувача не знайдено" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ error: "Невірний пароль" });

  const payload = { id: user._id, name: user.name, email: user.email, phone: user.phone };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

  res.setHeader('Set-Cookie', cookie.serialize('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
    sameSite: 'lax',
  }));

  res.status(200).json({ message: 'Вхід успішний', user: payload });
}
