const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = 'mongodb+srv://akapara2006:<password>@airbnbcluster.f4yicgi.mongodb.net/?retryWrites=true&w=majority&appName=AirBnbCluster';

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
    try {
    await client.connect();
    await client.db("airbnb").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

        await client.close();
    }
}

run().catch(console.dir);

