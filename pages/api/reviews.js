import { getReviews } from "../../lib/reviews";

export default async function handler(req, res) {
  try {
    const reviews = await getReviews(2); //передаем id нужного листинга
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error getting reviews:", error);
    res.status(500).json({ error: "Server error: " });
  }
}
