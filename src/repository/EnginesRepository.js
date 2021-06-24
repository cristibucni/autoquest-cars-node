import AbstractRepository from "./AbstractRepository";

class EnginesRepository extends AbstractRepository {
  findAll = async (query = {}) => {
    const db = await this.makeDb();
    const result = await db.collection("engines").find(query);
    const engines = (await result.toArray()).map(({ _id: id, ...found }) => ({
      id,
      ...found,
      powerHP: Math.floor(found.power * this.KW_TO_METRIC_HP),
    }));

    // Populate fuel based on fuelTypeReference
    await Promise.all(
      engines.map(async (engine, idx) => {
        engines[idx].fuel = await this.findFuelTypeById(
          engine.fuelTypeReference
        );
        delete engines[idx].fuelTypeReference;
      })
    );

    return engines;
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
