import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const client = await clientPromise;
      const db = client.db('airbnb');
      const data = await db.collection('reviews').find({}).toArray();
      res.status(200).json(data);
    } catch (err) {
      res.status(500).json({ error: 'DB error' });
    }
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}