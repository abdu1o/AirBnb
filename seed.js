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
      db.collection('categories').deleteMany({}),
    ]);

    const users = [
      { 
        name: 'John Doe', 
        email: 'john@example.com',
        password: 'qwe123',
        phone: '+380123456789',
        avatarUrl: 'https://airbnb-bucket666.s3.eu-north-1.amazonaws.com/users/user1.png',
        dob: '1990-05-12',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Mauris euismod, nisl vel tincidunt tempor, nisl nisl aliquet nisl, vitae aliquet nisl nisl eu nisl.'
      },
      { 
        name: 'Alice Smith', 
        email: 'alice@example.com',
        password: 'zxc123',
        phone: '+380501234567',
        avatarUrl: 'https://airbnb-bucket666.s3.eu-north-1.amazonaws.com/users/user2.png',
        dob: '1995-08-22',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Mauris euismod, nisl vel tincidunt tempor, nisl nisl aliquet nisl, vitae aliquet nisl nisl eu nisl.'
      }
    ];
    
    const userResult = await db.collection('users').insertMany(users);
    const userIds = Object.values(userResult.insertedIds);

    const categories = [
      { name: 'Гарні краєвиди' },
      { name: 'Великі квартири' },
      { name: 'Кімнати' },
      { name: 'Хостели' },
      { name: 'У центрі міста' },
      { name: 'Сільська місцевість' },
      { name: 'Від дизайнера' },
      { name: 'Біля моря' },
      { name: 'Особняки' },
      { name: 'Легендарне' },
    ]

    const catResult = await db.collection('categories').insertMany(categories);
    const categoryIds = Object.values(catResult.insertedIds);

  const listings = [
    {
      title: "Одеса, Україна",
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
      amenities: { wifi: true, washer: true, kitchen: true, airConditioning: false, heating: true, tv: true, parking: false, balcony: true },
      lat: 46.4845,
      lng: 30.7326,
      exactAddress: "Французький бульвар, 12",
      categories: [categoryIds[8], categoryIds[0]]
    },
    {
      title: "Одеса, Україна",
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
      amenities: { wifi: true, washer: false, kitchen: true, airConditioning: true, heating: true, tv: true, parking: false, balcony: true },
      lat: 46.4848,
      lng: 30.7330,
      exactAddress: "Французький бульвар, 15",
      categories: [categoryIds[8], categoryIds[7]]
    },
    {
      title: "Одеса, Україна",
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
      amenities: { wifi: true, washer: true, kitchen: true, airConditioning: false, heating: true, tv: true, parking: true, balcony: false },
      lat: 46.4852,
      lng: 30.7340,
      exactAddress: "Набережна дорога, 21",
      categories: [categoryIds[8], categoryIds[2]]
    },
    {
      title: "Львів, Україна",
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
      amenities: { wifi: true, washer: true, kitchen: true, airConditioning: false, heating: true, tv: true, parking: false, balcony: true },
      lat: 49.8419,
      lng: 24.0315,
      exactAddress: "вул. Староєврейська, 7",
      categories: [categoryIds[5], categoryIds[0]]
    },
    {
      title: "Київ, Україна",
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
      amenities: { wifi: true, washer: true, kitchen: true, airConditioning: true, heating: true, tv: true, parking: true, balcony: true },
      lat: 50.4632,
      lng: 30.5170,
      exactAddress: "вул. Костянтинівська, 12, кв. 5",
      categories: [categoryIds[5], categoryIds[2]]
    },
    {
      title: "Харків, Україна",
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
      amenities: { wifi: true, washer: false, kitchen: true, airConditioning: false, heating: true, tv: true, parking: true, balcony: false },
      lat: 50.0077,
      lng: 36.2290,
      exactAddress: "вул. Сумська, 45",
      categories: [categoryIds[1]]
    },
    {
      title: "Дніпро, Україна",
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
      amenities: { wifi: true, washer: true, kitchen: true, airConditioning: true, heating: true, tv: true, parking: false, balcony: true },
      lat: 48.4647,
      lng: 35.0462,
      exactAddress: "просп. Дніпровський, 3",
      categories: [categoryIds[8], categoryIds[0]]
    },
    {
      title: "Полтава, Україна",
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
      amenities: { wifi: true, washer: false, kitchen: true, airConditioning: false, heating: true, tv: true, parking: false, balcony: false },
      lat: 49.5901,
      lng: 34.5514,
      exactAddress: "вул. Миру, 10",
      categories: [categoryIds[1], categoryIds[6]]
    },
    {
      title: "Луцьк, Україна",
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
      amenities: { wifi: true, washer: true, kitchen: true, airConditioning: false, heating: true, tv: true, parking: false, balcony: false },
      lat: 50.7472,
      lng: 25.3251,
      exactAddress: "вул. Лесі Українки, 6",
      categories: [categoryIds[5], categoryIds[10]]
    },
    {
      title: "Рівне, Україна",
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
      amenities: { wifi: true, washer: false, kitchen: true, airConditioning: false, heating: true, tv: true, parking: true, balcony: false },
      lat: 50.6199,
      lng: 26.2516,
      exactAddress: "вул. Шевченка, 18",
      categories: [categoryIds[1], categoryIds[5]]
    },
    {
      title: "Івано-Франківськ, Україна",
      price: 65,
      location: "Центр",
      dateFrom: "2025-09-15",
      dateTo: "2025-09-20",
      hostId: userIds[0],
      rating: 4.56,
      imageUrl: "https://airbnb-bucket666.s3.eu-north-1.amazonaws.com/listings/listing11.png",
      childrenAllowed: true,
      petsAllowed: true,
      description: "Квартира у центрі Івано-Франківська з балконом і сучасними меблями",
      details: { guests: 3, bedrooms: 1, beds: 2, bathrooms: 1 },
      amenities: { wifi: true, washer: true, kitchen: true, airConditioning: false, heating: true, tv: true, parking: false, balcony: true },
      lat: 48.9226,
      lng: 24.7103,
      exactAddress: "вул. Незалежності, 20",
      categories: [categoryIds[5], categoryIds[1]]
    },
    {
      title: "Вінниця, Україна",
      price: 70,
      location: "Центр",
      dateFrom: "2025-09-25",
      dateTo: "2025-09-30",
      hostId: userIds[1],
      rating: 4.61,
      imageUrl: "https://airbnb-bucket666.s3.eu-north-1.amazonaws.com/listings/listing12.png",
      childrenAllowed: false,
      petsAllowed: false,
      description: "Зручна квартира у центрі Вінниці поруч із фонтаном Roshen",
      details: { guests: 2, bedrooms: 1, beds: 1, bathrooms: 1 },
      amenities: { wifi: true, washer: true, kitchen: true, airConditioning: true, heating: true, tv: true, parking: true, balcony: false },
      lat: 49.2331,
      lng: 28.4682,
      exactAddress: "вул. Соборна, 45",
      categories: [categoryIds[5], categoryIds[10]]
    },
    {
      title: "Чернігів, Україна",
      price: 52,
      location: "Центр",
      dateFrom: "2025-08-21",
      dateTo: "2025-08-26",
      hostId: userIds[0],
      rating: 4.29,
      imageUrl: "https://airbnb-bucket666.s3.eu-north-1.amazonaws.com/listings/listing13.png",
      childrenAllowed: true,
      petsAllowed: false,
      description: "Квартира поруч із історичним валом Чернігова",
      details: { guests: 2, bedrooms: 1, beds: 1, bathrooms: 1 },
      amenities: { wifi: true, washer: false, kitchen: true, airConditioning: false, heating: true, tv: true, parking: true, balcony: false },
      lat: 51.4982,
      lng: 31.2893,
      exactAddress: "вул. Гетьмана Полуботка, 12",
      categories: [categoryIds[5]]
    },
    {
      title: "Ужгород, Україна",
      price: 58,
      location: "Центр",
      dateFrom: "2025-10-02",
      dateTo: "2025-10-08",
      hostId: userIds[1],
      rating: 4.39,
      imageUrl: "https://airbnb-bucket666.s3.eu-north-1.amazonaws.com/listings/listing14.png",
      childrenAllowed: true,
      petsAllowed: true,
      description: "Автентична квартира в історичному центрі Ужгорода",
      details: { guests: 3, bedrooms: 1, beds: 2, bathrooms: 1 },
      amenities: { wifi: true, washer: true, kitchen: true, airConditioning: false, heating: true, tv: false, parking: false, balcony: false },
      lat: 48.6239,
      lng: 22.2950,
      exactAddress: "пл. Корятовича, 4",
      categories: [categoryIds[5], categoryIds[10]]
    },
    {
      title: "Запоріжжя, Україна",
      price: 75,
      location: "Біля Дніпра",
      dateFrom: "2025-09-12",
      dateTo: "2025-09-17",
      hostId: userIds[0],
      rating: 4.47,
      imageUrl: "https://airbnb-bucket666.s3.eu-north-1.amazonaws.com/listings/listing15.png",
      childrenAllowed: false,
      petsAllowed: true,
      description: "Простора квартира біля Дніпра з видом на річку",
      details: { guests: 4, bedrooms: 2, beds: 2, bathrooms: 1 },
      amenities: { wifi: true, washer: true, kitchen: true, airConditioning: true, heating: true, tv: true, parking: true, balcony: true },
      lat: 47.8388,
      lng: 35.1396,
      exactAddress: "просп. Соборний, 200",
      categories: [categoryIds[8], categoryIds[0]]
    },
    {
      title: "Тернопіль, Україна",
      price: 53,
      location: "Центр",
      dateFrom: "2025-09-18",
      dateTo: "2025-09-22",
      hostId: userIds[1],
      rating: 4.31,
      imageUrl: "https://airbnb-bucket666.s3.eu-north-1.amazonaws.com/listings/listing16.png",
      childrenAllowed: true,
      petsAllowed: false,
      description: "Квартира біля Тернопільського ставу з гарним видом",
      details: { guests: 2, bedrooms: 1, beds: 1, bathrooms: 1 },
      amenities: { wifi: true, washer: false, kitchen: true, airConditioning: false, heating: true, tv: true, parking: false, balcony: true },
      lat: 49.5535,
      lng: 25.5948,
      exactAddress: "вул. Руська, 33",
      categories: [categoryIds[0], categoryIds[6]]
    },
    {
      title: "Миколаїв, Україна",
      price: 62,
      location: "Центр",
      dateFrom: "2025-10-15",
      dateTo: "2025-10-20",
      hostId: userIds[1],
      rating: 4.41,
      imageUrl: "https://airbnb-bucket666.s3.eu-north-1.amazonaws.com/listings/listing17.png",
      childrenAllowed: false,
      petsAllowed: true,
      description: "Квартира в центрі Миколаєва поруч із Соборною площею",
      details: { guests: 2, bedrooms: 1, beds: 1, bathrooms: 1 },
      amenities: { wifi: true, washer: true, kitchen: true, airConditioning: true, heating: true, tv: true, parking: false, balcony: false },
      lat: 46.9750,
      lng: 31.9946,
      exactAddress: "вул. Адміральська, 15",
      categories: [categoryIds[5]]
    },
    {
      title: "Суми, Україна",
      price: 49,
      location: "Центр",
      dateFrom: "2025-09-07",
      dateTo: "2025-09-11",
      hostId: userIds[0],
      rating: 4.18,
      imageUrl: "https://airbnb-bucket666.s3.eu-north-1.amazonaws.com/listings/listing18.png",
      childrenAllowed: true,
      petsAllowed: false,
      description: "Невелика квартира у центрі Сум для коротких подорожей",
      details: { guests: 2, bedrooms: 1, beds: 1, bathrooms: 1 },
      amenities: { wifi: true, washer: false, kitchen: true, airConditioning: false, heating: true, tv: false, parking: false, balcony: false },
      lat: 50.9077,
      lng: 34.7981,
      exactAddress: "вул. Харківська, 8",
      categories: [categoryIds[1], categoryIds[5]]
    },
    {
      title: "Червнівці, Україна",
      price: 66,
      location: "Центр",
      dateFrom: "2025-10-05",
      dateTo: "2025-10-09",
      hostId: userIds[0],
      rating: 4.52,
      imageUrl: "https://airbnb-bucket666.s3.eu-north-1.amazonaws.com/listings/listing19.png",
      childrenAllowed: true,
      petsAllowed: true,
      description: "Квартира біля Чернівецького університету з історичним шармом",
      details: { guests: 3, bedrooms: 1, beds: 2, bathrooms: 1 },
      amenities: { wifi: true, washer: true, kitchen: true, airConditioning: true, heating: true, tv: true, parking: false, balcony: true },
      lat: 48.2915,
      lng: 25.9403,
      exactAddress: "вул. Університетська, 1",
      categories: [categoryIds[10], categoryIds[5]]
    },
    {
      title: "Маріуполь, Україна",
      price: 72,
      location: "Біля моря",
      dateFrom: "2025-09-27",
      dateTo: "2025-10-03",
      hostId: userIds[1],
      rating: 4.63,
      imageUrl: "https://airbnb-bucket666.s3.eu-north-1.amazonaws.com/listings/listing20.png",
      childrenAllowed: false,
      petsAllowed: true,
      description: "Квартира біля моря з сучасним ремонтом та панорамними вікнами",
      details: { guests: 4, bedrooms: 2, beds: 3, bathrooms: 1 },
      amenities: { wifi: true, washer: true, kitchen: true, airConditioning: true, heating: true, tv: true, parking: true, balcony: true },
      lat: 47.0951,
      lng: 37.5413,
      exactAddress: "просп. Миру, 50",
      categories: [categoryIds[8], categoryIds[0]]
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

  const comments = [
    'Awesome place! Everything was clean and cozy, really enjoyed my stay.',
    'Very comfortable. The bed was soft and the room had everything I needed.',
    'Great value for money! Location is perfect and host was very responsive.',
    'Cozy and nice location. Close to shops and restaurants, highly recommend.',
    'Perfect stay, super clean! Felt like home, everything was well maintained.',
    'It was okay, but a bit noisy from the street, still overall nice.',
    'Quiet area, slept very well. Great for relaxing and working remotely.',
    'Loved the view from the balcony! Sunrise and sunset were breathtaking.',
    'Nice host and comfortable bed. The kitchen had all the essentials.',
    'Would definitely book again! Enjoyed every minute, great amenities.',
    'Spacious apartment, very bright and airy, perfect for a family stay.',
    'Everything was exactly as described, really convenient location.',
    'Friendly host, smooth check-in process, and comfortable living space.',
    'The apartment had a lovely atmosphere, great for a short getaway.',
    'Good value, well-equipped and clean, would recommend to friends.',
    'Amazing stay! The neighborhood was safe and quiet, felt at home.',
    'Great communication with host, and all facilities worked perfectly.',
    'Comfortable and stylish apartment, very cozy for couples or solo.',
    'Excellent place, very clean, convenient access to public transport.',
    'Really enjoyed the apartment, everything was tidy and functional.'
  ];


    const reviews = [];

    listingIds.forEach((listingId, index) => {
      reviews.push({
        listingId,
        userId: userIds[index % userIds.length],
        rating: Math.floor(Math.random() * 3) + 3,
        comment: comments[Math.floor(Math.random() * comments.length)]
      });

      if (Math.random() > 0.5) {
        reviews.push({
          listingId,
          userId: userIds[(index + 1) % userIds.length],
          rating: Math.floor(Math.random() * 3) + 3,
          comment: comments[Math.floor(Math.random() * comments.length)]
        });
      }

      if (Math.random() > 0.75) {
        reviews.push({
          listingId,
          userId: userIds[index % userIds.length],
          rating: Math.floor(Math.random() * 3) + 3,
          comment: comments[Math.floor(Math.random() * comments.length)]
        });
      }
    });


    await db.collection('bookings').insertMany(bookings);
    await db.collection('favorites').insertMany(favorites);
    await db.collection('payments').insertMany(payments);
    await db.collection('reviews').insertMany(reviews);

    console.log('Database seeded ✅');
  } catch (err) {
    console.error('Error seeding:', err);
  } finally {
    await client.close();
  }
}

seed();
