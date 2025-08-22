export async function getSearchState() {
  const res = await fetch("http://localhost:3000/api/searchState"); 
  if (!res.ok) {
    throw new Error("Failed to fetch search state");
  }
  return res.json();
}
