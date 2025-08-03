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

    const users = [
      { _id: 1, name: 'John Doe', email: 'john@example.com' },
      { _id: 2, name: 'Alice Smith', email: 'alice@example.com' }
    ];

const listings = [
  { _id: 1, title: 'Odesa, Ukraine', price: 70, location: 'Біля моря', dateFrom: '2025-11-01', dateTo: '2025-11-10', hostId: 1, rating: 4.88, imageUrl: 'https://airbnb-bucket666.s3.eu-north-1.amazonaws.com/listing1.jpg' },
  { _id: 2, title: 'Odesa, Ukraine', price: 100, location: 'Біля моря', dateFrom: '2025-11-02', dateTo: '2025-11-07', hostId: 1, rating: 4.98, imageUrl: 'https://airbnb-bucket666.s3.eu-north-1.amazonaws.com/listing2.jpg' },
  { _id: 3, title: 'Odesa, Ukraine', price: 70, location: 'Біля моря', dateFrom: '2025-11-01', dateTo: '2025-11-10', hostId: 1, rating: 4.88, imageUrl: 'https://airbnb-bucket666.s3.eu-north-1.amazonaws.com/listing3.jpg' },
  { _id: 4, title: 'Lviv, Ukraine', price: 85, location: 'Центр', dateFrom: '2025-10-10', dateTo: '2025-10-18', hostId: 2, rating: 4.72, imageUrl: 'https://airbnb-bucket666.s3.eu-north-1.amazonaws.com/listing4.jpg' },
  { _id: 5, title: 'Kyiv, Ukraine', price: 120, location: 'Поділ', dateFrom: '2025-09-20', dateTo: '2025-09-25', hostId: 2, rating: 4.94, imageUrl: 'https://airbnb-bucket666.s3.eu-north-1.amazonaws.com/listing5.jpg' },
  { _id: 6, title: 'Kharkiv, Ukraine', price: 60, location: 'Північ', dateFrom: '2025-08-15', dateTo: '2025-08-20', hostId: 3, rating: 4.45, imageUrl: 'https://airbnb-bucket666.s3.eu-north-1.amazonaws.com/listing6.png' },
  { _id: 7, title: 'Dnipro, Ukraine', price: 90, location: 'Набережна', dateFrom: '2025-10-01', dateTo: '2025-10-05', hostId: 3, rating: 4.67, imageUrl: 'https://airbnb-bucket666.s3.eu-north-1.amazonaws.com/listing7.png' },
  { _id: 8, title: 'Poltava, Ukraine', price: 55, location: 'Біля парку', dateFrom: '2025-08-11', dateTo: '2025-08-14', hostId: 4, rating: 4.23, imageUrl: 'https://airbnb-bucket666.s3.eu-north-1.amazonaws.com/listing8.png' },
  { _id: 9, title: 'Lutsk, Ukraine', price: 48, location: 'Старе місто', dateFrom: '2025-09-01', dateTo: '2025-09-04', hostId: 4, rating: 4.11, imageUrl: 'https://airbnb-bucket666.s3.eu-north-1.amazonaws.com/listing9.png' },
  { _id: 10, title: 'Rivne, Ukraine', price: 50, location: 'Центр', dateFrom: '2025-10-06', dateTo: '2025-10-12', hostId: 5, rating: 4.33, imageUrl: 'https://airbnb-bucket666.s3.eu-north-1.amazonaws.com/listing10.png' },
  { _id: 11, title: 'Ivano-Frankivsk, Ukraine', price: 75, location: 'Площа Ринок', dateFrom: '2025-11-01', dateTo: '2025-11-03', hostId: 6, rating: 4.78, imageUrl: 'https://airbnb-bucket666.s3.eu-north-1.amazonaws.com/listing11.png' },
  { _id: 12, title: 'Chernihiv, Ukraine', price: 68, location: 'Біля річки', dateFrom: '2025-09-10', dateTo: '2025-09-15', hostId: 7, rating: 4.55, imageUrl: 'https://airbnb-bucket666.s3.eu-north-1.amazonaws.com/listing12.png' },
  { _id: 13, title: 'Vinnytsia, Ukraine', price: 85, location: 'Набережна', dateFrom: '2025-09-20', dateTo: '2025-09-23', hostId: 8, rating: 4.70, imageUrl: 'https://airbnb-bucket666.s3.eu-north-1.amazonaws.com/listing13.png' },
  { _id: 14, title: 'Ternopil, Ukraine', price: 60, location: 'Центр', dateFrom: '2025-10-01', dateTo: '2025-10-05', hostId: 8, rating: 4.32, imageUrl: 'https://airbnb-bucket666.s3.eu-north-1.amazonaws.com/listing14.png' },
  { _id: 15, title: 'Zaporizhzhia, Ukraine', price: 70, location: 'Біля Дніпра', dateFrom: '2025-08-12', dateTo: '2025-08-16', hostId: 9, rating: 4.28, imageUrl: 'https://airbnb-bucket666.s3.eu-north-1.amazonaws.com/listing15.png' },
  { _id: 16, title: 'Zhytomyr, Ukraine', price: 52, location: 'Околиця', dateFrom: '2025-07-30', dateTo: '2025-08-04', hostId: 9, rating: 4.12, imageUrl: 'https://airbnb-bucket666.s3.eu-north-1.amazonaws.com/listing16.png' },
  { _id: 17, title: 'Sumy, Ukraine', price: 58, location: 'Центр', dateFrom: '2025-11-11', dateTo: '2025-11-15', hostId: 10, rating: 4.46, imageUrl: 'https://airbnb-bucket666.s3.eu-north-1.amazonaws.com/listing17.png' },
  { _id: 18, title: 'Mykolaiv, Ukraine', price: 65, location: 'Біля річки', dateFrom: '2025-10-12', dateTo: '2025-10-18', hostId: 10, rating: 4.51, imageUrl: 'https://airbnb-bucket666.s3.eu-north-1.amazonaws.com/listing18.png' },
  { _id: 19, title: 'Uzhhorod, Ukraine', price: 80, location: 'Гори', dateFrom: '2025-11-05', dateTo: '2025-11-10', hostId: 11, rating: 4.89, imageUrl: 'https://airbnb-bucket666.s3.eu-north-1.amazonaws.com/listing19.png' },
  { _id: 20, title: 'Chernivtsi, Ukraine', price: 75, location: 'Старе місто', dateFrom: '2025-10-20', dateTo: '2025-10-25', hostId: 11, rating: 4.68, imageUrl: 'https://airbnb-bucket666.s3.eu-north-1.amazonaws.com/listing20.png' },
];

    const bookings = [
      { userId: 1, listingId: 2},
      { userId: 2, listingId: 1}
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