import mongodb from "mongodb";
import CarsRepository from "./CarsRepository";

const MongoClient = mongodb.MongoClient;
const mongoKey = process.env.MONGO_KEY;
const dbName = process.env.DB_NAME;
const client = new MongoClient(mongoKey, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export async function makeDb() {
  if (!client.isConnected()) {
    await client.connect();
  }
  return client.db(dbName);
}

const carsDB = new CarsRepository({ makeDb });
export default carsDB;
