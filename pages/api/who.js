import { saveWho } from "../../lib/filtersStorage";

export default function handler(req, res) {
  if (req.method === "POST") {
    saveWho(req.body);
    return res.status(200).json({ message: "Who filters saved" });
  }
  res.status(405).json({ error: "Method not allowed" });
}
