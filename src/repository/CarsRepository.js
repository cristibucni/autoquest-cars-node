import { ObjectId } from "mongodb";
import AbstractRepository from "./AbstractRepository";

class CarsRepository extends AbstractRepository {
  findAll = async (query = {}) => {
    const db = await this.makeDb();
    const result = await db.collection("cars").find(query);
    return (await result.toArray()).map(({ _id: id, ...found }) => ({
      id,
      ...found,
    }));
  };

  findById = async ({ id: _id }) => {
    const db = await this.makeDb();
    const result = await db
      .collection("cars")
      .findOne({ _id: new ObjectId(_id) });
    if (!result) {
      return null;
    }
    const { _id: id, ...info } = result;

    return { id, ...info };
  };

  findByBrandId = async (id) => {
    const db = await this.makeDb();
    return await (
      await db.collection("cars").find({ makeRef: new ObjectId(id) })
    ).toArray();
  };

  findByModel = async (car) => {
    const db = await this.makeDb();
    const result = await db.collection("cars").findOne({ model: car.model });
    if (!result) {
      return null;
    }
    const { _id: id, ...info } = result;
    return {
      id,
      make: (await this.findBrandById(info.make)).name,
      ...info,
    };
  };

  insert = async ({ ...carInfo }) => {
    const db = await this.makeDb();
    const result = await db.collection("cars").insertOne({ ...carInfo });
    const { _id: id, ...insertedInfo } = result.ops[0];
    return { id, ...insertedInfo };
  };

  update = async ({ _id, ...carInfo }) => {
    const db = await this.makeDb();
    const result = await db
      .collection("cars")
      .updateOne({ _id }, { $set: { ...carInfo } });
    return result.modifiedCount > 0 ? { id: _id, ...carInfo } : null;
  };

  remove = async ({ id: _id }) => {
    const db = await this.makeDb();
    const result = await db.collection("cars").deleteOne({ _id });
    return result.deletedCount;
  };

  // Query to get all models for the brand based on id
  findBrandById = async (brandId) => {
    const db = await this.makeDb();
    return await db
      .collection("brands")
      .findOne({ _id: new ObjectId(brandId) });
  };
}

export default CarsRepository;
