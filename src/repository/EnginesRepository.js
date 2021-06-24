import AbstractRepository from "./AbstractRepository";
import { ObjectId } from "mongodb";

class EnginesRepository extends AbstractRepository {
  findAll = async (query = {}) => {
    const db = await this.makeDb();
    const result = await db.collection("engines").find(query);
    return (await result.toArray()).map(({ _id: id, ...found }) => ({
      id,
      ...found,
    }));
  };

  // Query to get engine by engineRef
  findById = async (engineRef) => {
    const db = await this.makeDb();
    return await db
      .collection("engines")
      .findOne({ _id: new ObjectId(engineRef) });
  };

  insert = async ({ ...engineInfo }) => {
    const db = await this.makeDb();
    const result = await db.collection("engines").insertOne({ ...engineInfo });
    const { _id: id, ...insertedInfo } = result.ops[0];
    return { id, ...insertedInfo };
  };

  update = async ({ _id, ...engineInfo }) => {
    const db = await this.makeDb();
    const result = await db
      .collection("engines")
      .updateOne({ _id }, { $set: { ...engineInfo } });
    return result.modifiedCount > 0 ? { id: _id, ...engineInfo } : null;
  };

  remove = async ({ id: _id }) => {
    const db = await this.makeDb();
    const result = await db.collection("engines").deleteOne({ _id });
    return result.deletedCount;
  };
}

export default EnginesRepository;
