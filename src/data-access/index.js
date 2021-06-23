import makeCarsDB from "./cars-db";
import mongodb from "mongodb";

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

const carsDB = makeCarsDB({ makeDb });
export default carsDB;
