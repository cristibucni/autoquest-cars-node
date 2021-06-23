import { ObjectId } from "mongodb";

export default function makeCarsDb({ makeDb }) {
  async function findAll(query = {}) {
    const db = await makeDb();
    const result = await db.collection("cars").find(query);
    return (await result.toArray()).map(({ _id: id, ...found }) => ({
      id,
      ...found,
    }));
  }

  async function findById({ id: _id }) {
    const db = await makeDb();
    const result = await db.collection("cars").find({ _id: new ObjectId(_id) });
    const found = await result.toArray();
    if (found.length === 0) {
      return null;
    }
    const { _id: id, ...info } = found[0];
    return { id, ...info };
  }

  async function findByVIN(car) {
    const db = await makeDb();
    const result = await db.collection("cars").find({ vin: car.vin });
    const found = await result.toArray();
    if (found.length === 0) {
      return null;
    }
    const { _id: id, ...info } = found[0];
    return { id, ...info };
  }

  async function insert({ ...carInfo }) {
    const db = await makeDb();
    const result = await db.collection("cars").insertOne({ ...carInfo });
    const { _id: id, ...insertedInfo } = result.ops[0];
    return { id, ...insertedInfo };
  }

  async function update({ ...carInfo }) {
    const db = await makeDb();
    const result = await db
      .collection("cars")
      .updateOne({ _id }, { $set: { ...carInfo } });
    return result.modifiedCount > 0 ? { id: _id, ...carInfo } : null;
  }

  async function remove({ id: _id }) {
    const db = await makeDb();
    const result = await db.collection("cars").deleteOne({ _id });
    return result.deletedCount;
  }

  return Object.freeze({
    findAll,
    findById,
    findByVIN,
    insert,
    remove,
    update,
  });
}
