export async function getSearchState() {
  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin 
      : process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/searchState`, {
    cache: "no-store", 
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch search state from ${baseUrl}`);
  }

  return res.json();
}
