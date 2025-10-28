export async function getSearchState(req) {

  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    (req
      ? `http${req.headers["x-forwarded-proto"] === "https" ? "s" : ""}://${req.headers.host}`
      : typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:3000");

  const res = await fetch(`${baseUrl}/api/searchState`, {
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch search state");
  }

  return res.json();
}
