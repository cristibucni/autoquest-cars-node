import mongodb from "mongodb";
import CarsRepository from "./CarsRepository";
import CarBrandsRepository from "./CarBrandsRepository";
import FuelTypesRepository from "./FuelTypesRepository";
import EnginesRespository from "./EnginesRespository";

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
const brandsDB = new CarBrandsRepository({ makeDb });
const fuelTypesDB = new FuelTypesRepository({ makeDb });
const enginesDB = new EnginesRespository({ makeDb });
export { carsDB, brandsDB, fuelTypesDB, enginesDB };
