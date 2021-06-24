import { ObjectId } from "mongodb";
import AbstractRepository from "./AbstractRepository";

class VehicleTypesRepository extends AbstractRepository {
  findAll = async (query = {}) => {
    const db = await this.makeDb();
    const result = await db.collection("vehicleTypes").find(query);

    return (await result.toArray()).map(({ _id: id, ...found }) => ({
      id,
      ...found,
    }));
  };

  findById = async ({ id: _id }) => {
    const db = await this.makeDb();
    const result = await db
      .collection("vehicleTypes")
      .find({ _id: new ObjectId(_id) });
    const found = await result.toArray();
    if (found.length === 0) {
      return null;
    }
    const { _id: id, ...info } = found[0];

    return { id, ...info };
  };

  findByName = async (vehicleTypeName) => {
    const db = await this.makeDb();
    const result = await db
      .collection("vehicleTypes")
      .findOne({ name: vehicleTypeName });
    if (!result) {
      return null;
    }
    const { _id: id, ...info } = result;

    return { id, ...info };
  };

  insert = async ({ ...vehicleTypeInfo }) => {
    const db = await this.makeDb();
    const result = await db
      .collection("vehicleTypes")
      .insertOne({ ...vehicleTypeInfo });
    const { _id: id, ...insertedInfo } = result.ops[0];
    return { id, ...insertedInfo };
  };

  update = async ({ _id, ...vehicleTypeInfo }) => {
    const db = await this.makeDb();
    const result = await db
      .collection("vehicleTypes")
      .updateOne({ _id }, { $set: { ...vehicleTypeInfo } });
    return result.modifiedCount > 0 ? { id: _id, ...vehicleTypeInfo } : null;
  };

  remove = async ({ id: _id }) => {
    const db = await this.makeDb();
    const result = await db.collection("vehicleTypes").deleteOne({ _id });
    return result.deletedCount;
  };
}

export default VehicleTypesRepository;
