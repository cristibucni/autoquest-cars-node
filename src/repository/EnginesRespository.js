import { ObjectId } from "mongodb";
import AbstractRepository from "./AbstractRepository";

const KW_TO_METRIC_HP = 1.3596216173;

class EngineRepository extends AbstractRepository {
  findAll = async (query = {}) => {
    const db = await this.makeDb();
    const result = await db.collection("engines").find(query);
    const engines = (await result.toArray()).map(({ _id: id, ...found }) => ({
      id,
      ...found,
      powerHP: Math.floor(found.power * KW_TO_METRIC_HP),
    }));

    // Populate fuel based on fuelTypeReference
    await Promise.all(
      engines.map(async (engine, idx) => {
        engines[idx].fuel = await this.getFuelType(engine.fuelTypeReference);
        delete engines[idx].fuelTypeReference;
      })
    );

    return engines;
  };

  findById = async ({ id: _id }) => {
    const db = await this.makeDb();
    const result = await db
      .collection("engines")
      .find({ _id: new ObjectId(_id) });
    const found = await result.toArray();
    if (found.length === 0) {
      return null;
    }
    const { _id: id, ...info } = found[0];

    return { id, ...info };
  };

  findByName = async (engineName) => {
    const db = await this.makeDb();
    const result = await db.collection("engines").findOne({ name: engineName });
    if (!result) {
      return null;
    }
    const { _id: id, ...info } = result;

    return { id, ...info };
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

export default EngineRepository;
