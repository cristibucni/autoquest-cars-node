import { ObjectId } from "mongodb";
import AbstractRepository from "./AbstractRepository";

class CarBrandsRepository extends AbstractRepository {
  findAll = async (query = {}) => {
    const db = await this.makeDb();
    const result = await db.collection("brands").find(query);
    return (await result.toArray()).map(({ _id: id, ...found }) => ({
      id,
      ...found,
    }));
  };

  findById = async ({ id: _id }) => {
    const db = await this.makeDb();
    const result = await db
      .collection("brands")
      .find({ _id: new ObjectId(_id) });
    const found = await result.toArray();
    if (found.length === 0) {
      return null;
    }
    const { _id: id, ...info } = found[0];

    return { id, ...info };
  };

  findByName = async (brand) => {
    const db = await this.makeDb();
    const result = await db.collection("brands").find({ name: brand.name });
    const found = await result.toArray();
    if (found.length === 0) {
      return null;
    }
    const { _id: id, ...info } = found[0];

    return { id, ...info };
  };

  insert = async ({ ...brandInfo }) => {
    const db = await this.makeDb();
    const result = await db.collection("brands").insertOne({ ...brandInfo });
    const { _id: id, ...insertedInfo } = result.ops[0];
    return { id, ...insertedInfo };
  };

  insertMany = async (brands) => {
    const db = await this.makeDb();
    const result = await db.collection("brands").insertMany(brands);
    console.log(result);
  };

  update = async ({ _id, ...brandInfo }) => {
    const db = await this.makeDb();
    const result = await db
      .collection("brands")
      .updateOne({ _id }, { $set: { ...brandInfo } });
    return result.modifiedCount > 0 ? { id: _id, ...brandInfo } : null;
  };

  remove = async ({ id: _id }) => {
    const db = await this.makeDb();
    const result = await db.collection("brands").deleteOne({ _id });
    return result.deletedCount;
  };
}

export default CarBrandsRepository;
