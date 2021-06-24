import AbstractRepository from "./AbstractRepository";
import { ObjectId } from "mongodb";

class FuelTypesRepository extends AbstractRepository {
  findAll = async (query = {}) => {
    const db = await this.makeDb();
    const result = await db.collection("fuelTypes").find(query);
    return (await result.toArray()).map(({ _id: id, ...found }) => ({
      id,
      ...found,
    }));
  };

  // Query to get fuel type name based on fuelType ref
  findById = async (fuelTypeId) => {
    const db = await this.makeDb();
    const result = await db
      .collection("fuelTypes")
      .findOne({ _id: new ObjectId(fuelTypeId) });
    return {
      name: result.name,
      id: result._id,
      createdOn: result.createdOn,
      modifiedOn: result.modifiedOn,
    };
  };

  findByName = async (name) => {
    const db = await this.makeDb();
    const result = await db.collection("fuelTypes").findOne({ name: name });

    if (!result) {
      return null;
    }
    const { _id: id, ...info } = result;

    return { id, ...info };
  };

  insert = async ({ ...fuelTypeInfo }) => {
    const db = await this.makeDb();
    const result = await db
      .collection("fuelTypes")
      .insertOne({ ...fuelTypeInfo });
    const { _id: id, ...insertedInfo } = result.ops[0];
    return { id, ...insertedInfo };
  };

  update = async ({ _id, ...fuelTypeInfo }) => {
    const db = await this.makeDb();

    const result = await db
      .collection("fuelTypes")
      .updateOne({ _id }, { $set: { ...fuelTypeInfo } });

    return result.modifiedCount > 0 ? { id: _id, ...fuelTypeInfo } : null;
  };

  remove = async ({ id: _id }) => {
    const db = await this.makeDb();
    const result = await db.collection("fuelTypes").deleteOne({ _id });
    return result.deletedCount;
  };
}

export default FuelTypesRepository;
