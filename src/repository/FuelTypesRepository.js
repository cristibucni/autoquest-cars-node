import AbstractRepository from "./AbstractRepository";

class FuelTypesRepository extends AbstractRepository {
  findAll = async (query = {}) => {
    const db = await this.makeDb();
    const result = await db.collection("fuelTypes").find(query);
    return (await result.toArray()).map(({ _id: id, ...found }) => ({
      id,
      ...found,
    }));
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
