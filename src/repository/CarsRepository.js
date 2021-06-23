import { ObjectId } from "mongodb";

class CarsRepository {
  #makeDb;
  constructor({ makeDb }) {
    this.#makeDb = makeDb;
  }

  findAll = async (query = {}) => {
    const db = await this.#makeDb();
    const result = await db.collection("cars").find(query);
    const cars = (await result.toArray()).map(({ _id: id, ...found }) => ({
      id,
      ...found,
    }));

    //Populate brand
    await Promise.all(
      cars.map(async (car, idx) => {
        cars[idx].make = (await this.getBrandForModel(car.make)).name;
      })
    );

    return cars;
  };

  findById = async ({ id: _id }) => {
    const db = await this.#makeDb();
    const result = await db
      .collection("cars")
      .findOne({ _id: new ObjectId(_id) });
    if (!result) {
      return null;
    }
    const { _id: id, ...info } = result;
    return { id, ...info, make: (await this.getBrandForModel(info.make)).name };
  };

  findByVIN = async (car) => {
    const db = await this.#makeDb();
    const result = await db.collection("cars").find({ vin: car.vin });
    const found = await result.toArray();
    if (found.length === 0) {
      return null;
    }
    const { _id: id, ...info } = found[0];
    return { id, ...info, make: (await this.getBrandForModel(info.make)).name };
  };

  insert = async ({ ...carInfo }) => {
    const db = await this.#makeDb();
    const result = await db.collection("cars").insertOne({ ...carInfo });
    const { _id: id, ...insertedInfo } = result.ops[0];
    return { id, ...insertedInfo };
  };

  update = async ({ _id, ...carInfo }) => {
    const db = await this.#makeDb();
    const result = await db
      .collection("cars")
      .updateOne({ _id }, { $set: { ...carInfo } });
    return result.modifiedCount > 0 ? { id: _id, ...carInfo } : null;
  };

  remove = async ({ id: _id }) => {
    const db = await this.#makeDb();
    const result = await db.collection("cars").deleteOne({ _id });
    return result.deletedCount;
  };

  // Query to get all models for the brand based on id
  getBrandForModel = async (brandId) => {
    const db = await this.#makeDb();
    return await db
      .collection("brands")
      .findOne({ _id: new ObjectId(brandId) });
  };
}

export default CarsRepository;
