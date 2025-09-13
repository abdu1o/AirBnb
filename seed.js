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
      { 
        name: 'John Doe', 
        email: 'john@example.com',
        password: 'qwe123',
        avatarUrl: 'https://airbnb-bucket666.s3.eu-north-1.amazonaws.com/users/user1.png'
      },
      { 
        name: 'Alice Smith', 
        email: 'alice@example.com',
        password: 'zxc123',
        avatarUrl: 'https://airbnb-bucket666.s3.eu-north-1.amazonaws.com/users/user2.png'
      }
    ];

    const userResult = await db.collection('users').insertMany(users);
    const userIds = Object.values(userResult.insertedIds);

    const listings = [
      {
        title: "Odesa, Ukraine",
        price: 70,
        location: "Біля моря",
        dateFrom: "2025-11-01",
        dateTo: "2025-11-10",
        hostId: userIds[0],
        rating: 4.88,
        imageUrl: "https://airbnb-bucket666.s3.eu-north-1.amazonaws.com/listings/listing1.jpg",
        childrenAllowed: true,
        petsAllowed: false,
        description: "Світла квартира біля моря з великим балконом і видом на захід сонця",
        details: { guests: 4, bedrooms: 2, beds: 2, bathrooms: 1 },
        amenities: { wifi: true, washer: true, kitchen: true, airConditioning: false, heating: true, tv: true, parking: false, balcony: true }
      },
      {
        title: "Odesa, Ukraine",
        price: 100,
        location: "Біля моря",
        dateFrom: "2025-11-02",
        dateTo: "2025-11-07",
        hostId: userIds[0],
        rating: 4.98,
        imageUrl: "https://airbnb-bucket666.s3.eu-north-1.amazonaws.com/listings/listing2.jpg",
        childrenAllowed: false,
        petsAllowed: true,
        description: "Стильна студія з дизайнерським інтер’єром та видом на море",
        details: { guests: 2, bedrooms: 1, beds: 1, bathrooms: 1 },
        amenities: { wifi: true, washer: false, kitchen: true, airConditioning: true, heating: true, tv: true, parking: false, balcony: true }
      },
      {
        title: "Odesa, Ukraine",
        price: 70,
        location: "Біля моря",
        dateFrom: "2025-11-01",
        dateTo: "2025-11-10",
        hostId: userIds[0],
        rating: 4.88,
        imageUrl: "https://airbnb-bucket666.s3.eu-north-1.amazonaws.com/listings/listing3.jpg",
        childrenAllowed: true,
        petsAllowed: true,
        description: "Комфортна квартира в пішій доступності до пляжу",
        details: { guests: 3, bedrooms: 1, beds: 2, bathrooms: 1 },
        amenities: { wifi: true, washer: true, kitchen: true, airConditioning: false, heating: true, tv: true, parking: true, balcony: false }
      },
      {
        title: "Lviv, Ukraine",
        price: 85,
        location: "Центр",
        dateFrom: "2025-10-10",
        dateTo: "2025-10-18",
        hostId: userIds[1],
        rating: 4.72,
        imageUrl: "https://airbnb-bucket666.s3.eu-north-1.amazonaws.com/listings/listing4.jpg",
        childrenAllowed: false,
        petsAllowed: false,
        description: "Затишна квартира у центрі Львова з видом на історичні вулиці",
        details: { guests: 2, bedrooms: 1, beds: 1, bathrooms: 1 },
        amenities: { wifi: true, washer: true, kitchen: true, airConditioning: false, heating: true, tv: true, parking: false, balcony: true }
      },
      {
        title: "Kyiv, Ukraine",
        price: 120,
        location: "Поділ",
        dateFrom: "2025-09-20",
        dateTo: "2025-09-25",
        hostId: userIds[1],
        rating: 4.94,
        imageUrl: "https://airbnb-bucket666.s3.eu-north-1.amazonaws.com/listings/listing5.jpg",
        childrenAllowed: true,
        petsAllowed: false,
        description: "Простора квартира на Подолі з сучасним ремонтом",
        details: { guests: 4, bedrooms: 2, beds: 3, bathrooms: 1 },
        amenities: { wifi: true, washer: true, kitchen: true, airConditioning: true, heating: true, tv: true, parking: true, balcony: true }
      },
      {
      title: "Kharkiv, Ukraine",
      price: 60,
      location: "Північ",
      dateFrom: "2025-08-15",
      dateTo: "2025-08-20",
      hostId: userIds[0],
      rating: 4.45,
      imageUrl: "https://airbnb-bucket666.s3.eu-north-1.amazonaws.com/listings/listing6.png",
      childrenAllowed: false,
      petsAllowed: true,
      description: "Невелика студія для подорожуючих у діловій частині міста",
      details: { guests: 2, bedrooms: 1, beds: 1, bathrooms: 1 },
      amenities: { wifi: true, washer: false, kitchen: true, airConditioning: false, heating: true, tv: true, parking: true, balcony: false }
    },
    {
      title: "Dnipro, Ukraine",
      price: 90,
      location: "Набережна",
      dateFrom: "2025-10-01",
      dateTo: "2025-10-05",
      hostId: userIds[0],
      rating: 4.67,
      imageUrl: "https://airbnb-bucket666.s3.eu-north-1.amazonaws.com/listings/listing7.png",
      childrenAllowed: true,
      petsAllowed: true,
      description: "Квартира біля набережної з панорамними вікнами",
      details: { guests: 3, bedrooms: 1, beds: 2, bathrooms: 1 },
      amenities: { wifi: true, washer: true, kitchen: true, airConditioning: true, heating: true, tv: true, parking: false, balcony: true }
    },
    {
      title: "Poltava, Ukraine",
      price: 55,
      location: "Біля парку",
      dateFrom: "2025-08-11",
      dateTo: "2025-08-14",
      hostId: userIds[1],
      rating: 4.23,
      imageUrl: "https://airbnb-bucket666.s3.eu-north-1.amazonaws.com/listings/listing8.png",
      childrenAllowed: false,
      petsAllowed: true,
      description: "Затишна квартира біля парку, ідеально для прогулянок",
      details: { guests: 2, bedrooms: 1, beds: 1, bathrooms: 1 },
      amenities: { wifi: true, washer: false, kitchen: true, airConditioning: false, heating: true, tv: true, parking: false, balcony: false }
    },
    {
      title: "Lutsk, Ukraine",
      price: 48,
      location: "Старе місто",
      dateFrom: "2025-09-01",
      dateTo: "2025-09-04",
      hostId: userIds[1],
      rating: 4.11,
      imageUrl: "https://airbnb-bucket666.s3.eu-north-1.amazonaws.com/listings/listing9.png",
      childrenAllowed: true,
      petsAllowed: false,
      description: "Квартира в самому серці старого міста з автентичним інтер’єром",
      details: { guests: 2, bedrooms: 1, beds: 1, bathrooms: 1 },
      amenities: { wifi: true, washer: true, kitchen: true, airConditioning: false, heating: true, tv: true, parking: false, balcony: false }
    },
    {
      title: "Rivne, Ukraine",
      price: 50,
      location: "Центр",
      dateFrom: "2025-10-06",
      dateTo: "2025-10-12",
      hostId: userIds[1],
      rating: 4.33,
      imageUrl: "https://airbnb-bucket666.s3.eu-north-1.amazonaws.com/listings/listing10.png",
      childrenAllowed: false,
      petsAllowed: false,
      description: "Невелика квартира з усім необхідним у центрі Рівного",
      details: { guests: 2, bedrooms: 1, beds: 1, bathrooms: 1 },
      amenities: { wifi: true, washer: false, kitchen: true, airConditioning: false, heating: true, tv: true, parking: true, balcony: false }
    },
    {
      title: "Ivano-Frankivsk, Ukraine",
      price: 75,
      location: "Площа Ринок",
      dateFrom: "2025-11-01",
      dateTo: "2025-11-03",
      hostId: userIds[0],
      rating: 4.78,
      imageUrl: "https://airbnb-bucket666.s3.eu-north-1.amazonaws.com/listings/listing11.png",
      childrenAllowed: true,
      petsAllowed: false,
      description: "Апартаменти біля площі Ринок з класичним інтер’єром",
      details: { guests: 3, bedrooms: 1, beds: 2, bathrooms: 1 },
      amenities: { wifi: true, washer: true, kitchen: true, airConditioning: false, heating: true, tv: true, parking: false, balcony: true }
    },
    {
      title: "Chernihiv, Ukraine",
      price: 68,
      location: "Біля річки",
      dateFrom: "2025-09-10",
      dateTo: "2025-09-15",
      hostId: userIds[0],
      rating: 4.55,
      imageUrl: "https://airbnb-bucket666.s3.eu-north-1.amazonaws.com/listings/listing12.png",
      childrenAllowed: false,
      petsAllowed: true,
      description: "Квартира з видом на річку, тихий та спокійний район",
      details: { guests: 2, bedrooms: 1, beds: 1, bathrooms: 1 },
      amenities: { wifi: true, washer: false, kitchen: true, airConditioning: false, heating: true, tv: true, parking: true, balcony: true }
    },
    {
      title: "Vinnytsia, Ukraine",
      price: 85,
      location: "Набережна",
      dateFrom: "2025-09-20",
      dateTo: "2025-09-23",
      hostId: userIds[1],
      rating: 4.70,
      imageUrl: "https://airbnb-bucket666.s3.eu-north-1.amazonaws.com/listings/listing13.png",
      childrenAllowed: true,
      petsAllowed: true,
      description: "Сучасна квартира біля набережної з панорамним видом",
      details: { guests: 4, bedrooms: 2, beds: 3, bathrooms: 1 },
      amenities: { wifi: true, washer: true, kitchen: true, airConditioning: true, heating: true, tv: true, parking: true, balcony: true }
    },
    {
      title: "Ternopil, Ukraine",
      price: 60,
      location: "Центр",
      dateFrom: "2025-10-01",
      dateTo: "2025-10-05",
      hostId: userIds[1],
      rating: 4.32,
      imageUrl: "https://airbnb-bucket666.s3.eu-north-1.amazonaws.com/listings/listing14.png",
      childrenAllowed: false,
      petsAllowed: false,
      description: "Затишна квартира у центрі Тернополя з балконом",
      details: { guests: 2, bedrooms: 1, beds: 1, bathrooms: 1 },
      amenities: { wifi: true, washer: false, kitchen: true, airConditioning: false, heating: true, tv: true, parking: false, balcony: true }
    },
    {
      title: "Zaporizhzhia, Ukraine",
      price: 70,
      location: "Біля Дніпра",
      dateFrom: "2025-08-12",
      dateTo: "2025-08-16",
      hostId: userIds[0],
      rating: 4.28,
      imageUrl: "https://airbnb-bucket666.s3.eu-north-1.amazonaws.com/listings/listing15.png",
      childrenAllowed: true,
      petsAllowed: true,
      description: "Квартира з видом на Дніпро, сучасний інтер’єр",
      details: { guests: 3, bedrooms: 1, beds: 2, bathrooms: 1 },
      amenities: { wifi: true, washer: true, kitchen: true, airConditioning: false, heating: true, tv: true, parking: true, balcony: true }
    },
    {
      title: "Zhytomyr, Ukraine",
      price: 52,
      location: "Околиця",
      dateFrom: "2025-07-30",
      dateTo: "2025-08-04",
      hostId: userIds[0],
      rating: 4.12,
      imageUrl: "https://airbnb-bucket666.s3.eu-north-1.amazonaws.com/listings/listing16.png",
      childrenAllowed: false,
      petsAllowed: true,
      description: "Невелика квартира на околиці міста з тихим двориком",
      details: { guests: 2, bedrooms: 1, beds: 1, bathrooms: 1 },
      amenities: { wifi: true, washer: false, kitchen: true, airConditioning: false, heating: true, tv: true, parking: true, balcony: false }
    },
    {
      title: "Sumy, Ukraine",
      price: 58,
      location: "Центр",
      dateFrom: "2025-11-11",
      dateTo: "2025-11-15",
      hostId: userIds[1],
      rating: 4.46,
      imageUrl: "https://airbnb-bucket666.s3.eu-north-1.amazonaws.com/listings/listing17.png",
      childrenAllowed: true,
      petsAllowed: false,
      description: "Апартаменти у центрі міста поруч з кафе та магазинами",
      details: { guests: 2, bedrooms: 1, beds: 1, bathrooms: 1 },
      amenities: { wifi: true, washer: true, kitchen: true, airConditioning: false, heating: true, tv: true, parking: false, balcony: true }
    },
    {
      title: "Mykolaiv, Ukraine",
      price: 65,
      location: "Біля річки",
      dateFrom: "2025-10-12",
      dateTo: "2025-10-18",
      hostId: userIds[0],
      rating: 4.51,
      imageUrl: "https://airbnb-bucket666.s3.eu-north-1.amazonaws.com/listings/listing18.png",
      childrenAllowed: false,
      petsAllowed: true,
      description: "Світла квартира біля річки з лоджією",
      details: { guests: 3, bedrooms: 1, beds: 2, bathrooms: 1 },
      amenities: { wifi: true, washer: false, kitchen: true, airConditioning: true, heating: true, tv: true, parking: true, balcony: true }
    },
    {
      title: "Uzhhorod, Ukraine",
      price: 80,
      location: "Гори",
      dateFrom: "2025-11-05",
      dateTo: "2025-11-10",
      hostId: userIds[1],
      rating: 4.89,
      imageUrl: "https://airbnb-bucket666.s3.eu-north-1.amazonaws.com/listings/listing19.png",
      childrenAllowed: true,
      petsAllowed: true,
      description: "Квартира з видом на гори, камін та дерев’яні меблі",
      details: { guests: 4, bedrooms: 2, beds: 3, bathrooms: 1 },
      amenities: { wifi: true, washer: true, kitchen: true, airConditioning: true, heating: true, tv: true, parking: true, balcony: true }
    },
    {
      title: "Chernivtsi, Ukraine",
      price: 75,
      location: "Старе місто",
      dateFrom: "2025-10-20",
      dateTo: "2025-10-25",
      hostId: userIds[0],
      rating: 4.68,
      imageUrl: "https://airbnb-bucket666.s3.eu-north-1.amazonaws.com/listings/listing20.png",
      childrenAllowed: false,
      petsAllowed: false,
      description: "Апартаменти у старому місті з автентичною атмосферою",
      details: { guests: 2, bedrooms: 1, beds: 1, bathrooms: 1 },
      amenities: { wifi: true, washer: true, kitchen: true, airConditioning: false, heating: true, tv: true, parking: false, balcony: true }
    }
  ];

    const listingResult = await db.collection('listings').insertMany(listings);
    const listingIds = Object.values(listingResult.insertedIds);

    const bookings = [
      { userId: userIds[0], listingId: listingIds[1] },
      { userId: userIds[1], listingId: listingIds[0] }
    ];

    const favorites = [
      { userId: userIds[0], listingId: listingIds[0] },
      { userId: userIds[1], listingId: listingIds[1] }
    ];

    const payments = [
      { userId: userIds[0], amount: 150, status: 'paid', method: 'card' },
      { userId: userIds[1], amount: 225, status: 'pending', method: 'paypal' }
    ];

    const reviews = [
      { listingId: listingIds[0], userId: userIds[1], rating: 5, comment: 'Awesome place!' },
      { listingId: listingIds[1], userId: userIds[0], rating: 4, comment: 'Very comfortable.' }
    ];

    await db.collection('bookings').insertMany(bookings);
    await db.collection('favorites').insertMany(favorites);
    await db.collection('payments').insertMany(payments);
    await db.collection('reviews').insertMany(reviews);

    console.log('Database seeded with ObjectId references ✅');
  } catch (err) {
    console.error('Error seeding:', err);
  } finally {
    await client.close();
  }
}

seed();
