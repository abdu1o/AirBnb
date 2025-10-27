import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ user: null });
  }

  try {
    const secret = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secret);

    return res.status(200).json({ user: decoded });
  } catch (err) {
    return res.status(401).json({ user: null });
  }
}
