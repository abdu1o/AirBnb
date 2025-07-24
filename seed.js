require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri);

async function seed() {
  try {
    await client.connect();
    const db = client.db('airbnb');

    await Promise.all([
      db.collection('bookings').deleteMany({}),
      db.collection('favorites').deleteMany({}),
      db.collection('listings').deleteMany({}),
      db.collection('payments').deleteMany({}),
      db.collection('reviews').deleteMany({}),
      db.collection('users').deleteMany({}),
    ]);

    // Дані
    const users = [
      { _id: 1, name: 'John Doe', email: 'john@example.com' },
      { _id: 2, name: 'Alice Smith', email: 'alice@example.com' }
    ];

    const listings = [
      { _id: 1, title: 'Cozy Apartment in Kyiv', price: 50, location: 'Kyiv', hostId: 1 },
      { _id: 2, title: 'Modern Loft in Lviv', price: 75, location: 'Lviv', hostId: 2 }
    ];

    const bookings = [
      { userId: 1, listingId: 2, dateFrom: '2025-07-25', dateTo: '2025-07-28' },
      { userId: 2, listingId: 1, dateFrom: '2025-07-29', dateTo: '2025-08-01' }
    ];

    const favorites = [
      { userId: 1, listingId: 1 },
      { userId: 2, listingId: 2 }
    ];

    const payments = [
      { userId: 1, amount: 150, status: 'paid', method: 'card' },
      { userId: 2, amount: 225, status: 'pending', method: 'paypal' }
    ];

    const reviews = [
      { listingId: 1, userId: 2, rating: 5, comment: 'Awesome place!' },
      { listingId: 2, userId: 1, rating: 4, comment: 'Very comfortable.' }
    ];

    await db.collection('users').insertMany(users);
    await db.collection('listings').insertMany(listings);
    await db.collection('bookings').insertMany(bookings);
    await db.collection('favorites').insertMany(favorites);
    await db.collection('payments').insertMany(payments);
    await db.collection('reviews').insertMany(reviews);

    console.log('Database seeded');
  } catch (err) {
    console.error('Error seeding:', err);
  } finally {
    await client.close();
  }
}

seed();
