import clientPromise from "../../lib/mongodb";
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('airbnb');

  if (req.method === 'GET') {
    try {
      const data = await db.collection('users').find({}).toArray();
      res.status(200).json(data);
    } catch (err) {
      res.status(500).json({ error: 'Помилка з базою даних' });
    }
} else if (req.method === 'POST') {
  try {
    const { email, phone, password, name, dob } = req.body;

    const exists = await db.collection('users').findOne({
      $or: [{ email }, { phone }],
    });
    if (exists) {
      return res.status(400).json({ error: 'Користувач з таким email або номером вже існує' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.collection('users').insertOne({ email, phone, name, dob, password: hashedPassword });
    res.status(201).json({ id: result.insertedId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Невідома помилка при створенні користувача' });
  }
} else {
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
