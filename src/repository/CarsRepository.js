import { ObjectId } from "mongodb";

class CarsRepository {
  #makeDb;
  constructor({ makeDb }) {
    this.#makeDb = makeDb;
  }

  findAll = async (query = {}) => {
    const db = await this.#makeDb();
    const result = await db.collection("cars").find(query);
    return (await result.toArray()).map(({ _id: id, ...found }) => ({
      id,
      ...found,
    }));
  };

  findById = async ({ id: _id }) => {
    const db = await this.#makeDb();
    const result = await db.collection("cars").find({ _id: new ObjectId(_id) });
    const found = await result.toArray();
    if (found.length === 0) {
      return null;
    }
    const { _id: id, ...info } = found[0];
    return { id, ...info };
  };

  findByVIN = async (car) => {
    const db = await this.#makeDb();
    const result = await db.collection("cars").find({ vin: car.vin });
    const found = await result.toArray();
    if (found.length === 0) {
      return null;
    }
    const { _id: id, ...info } = found[0];
    return { id, ...info };
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
}

export default CarsRepository;
