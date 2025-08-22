import { saveWhere } from "../../lib/filtersStorage";

export default function handler(req, res) {
  if (req.method === "POST") {
    saveWhere(req.body);
    return res.status(200).json({ message: "Where filters saved" });
  }
  res.status(405).json({ error: "Method not allowed" });
}
