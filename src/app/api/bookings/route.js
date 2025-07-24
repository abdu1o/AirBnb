import clientPromise from "../../../../lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('airbnb');
    const bookings = await db.collection('users').find({}).toArray();

    return Response.json(bookings);
  } catch (err) {
    console.error('MongoDB error:', err);
    return new Response(JSON.stringify({ error: 'DB error' }), { status: 500 });
  }
}
