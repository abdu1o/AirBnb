import clientPromise from "../../../../lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('airbnb');
    const listings = await db.collection('listings').find({}).toArray();

    return Response.json(listings);
  } catch (err) {
    console.error('MongoDB error:', err);
    return new Response(JSON.stringify({ error: 'DB error' }), { status: 500 });
  }
}
