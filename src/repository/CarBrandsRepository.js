import { ObjectId } from "mongodb";

class CarBrandsRepository {
  #makeDb;

  constructor({ makeDb }) {
    this.#makeDb = makeDb;
  }

  findAll = async (query = {}) => {
    const db = await this.#makeDb();
    const result = await db.collection("brands").find(query);
    const brands = (await result.toArray()).map(({ _id: id, ...found }) => ({
      id,
      ...found,
    }));

    // Populate models based on brand ID
    /*  await Promise.all(
      brands.map(async (brand, idx) => {
        brands[idx].models = await this.getModelsForBrand(brand.id);
      })
    );*/

    return brands;
  };

  findById = async ({ id: _id }) => {
    const db = await this.#makeDb();
    const result = await db
      .collection("brands")
      .find({ _id: new ObjectId(_id) });
    const found = await result.toArray();
    if (found.length === 0) {
      return null;
    }
    const { _id: id, ...info } = found[0];

    return { id, ...info, models: await this.getModelsForBrand(id) };
  };

  findByName = async (brand) => {
    const db = await this.#makeDb();
    const result = await db.collection("brands").find({ name: brand.name });
    const found = await result.toArray();
    if (found.length === 0) {
      return null;
    }
    const { _id: id, ...info } = found[0];

    return { id, ...info, models: await this.getModelsForBrand(id) };
  };

  insert = async ({ ...brandInfo }) => {
    const db = await this.#makeDb();
    const result = await db.collection("brands").insertOne({ ...brandInfo });
    const { _id: id, ...insertedInfo } = result.ops[0];
    return { id, ...insertedInfo };
  };

  update = async ({ _id, ...brandInfo }) => {
    const db = await this.#makeDb();
    const result = await db
      .collection("brands")
      .updateOne({ _id }, { $set: { ...brandInfo } });
    return result.modifiedCount > 0 ? { id: _id, ...brandInfo } : null;
  };

  remove = async ({ id: _id }) => {
    const db = await this.#makeDb();
    const result = await db.collection("brands").deleteOne({ _id });
    return result.deletedCount;
  };

  // Query to get all models for the brand based on id
  getModelsForBrand = async (id) => {
    const db = await this.#makeDb();
    return await db.collection("cars").find({ make: id }).toArray();
  };
}

export default CarBrandsRepository;
