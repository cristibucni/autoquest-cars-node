import { ObjectId } from "mongodb";
import AbstractRepository from "./AbstractRepository";

class CarBrandsRepository extends AbstractRepository {
  findAll = async (query = {}) => {
    const db = await this.makeDb();
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
    const db = await this.makeDb();
    const result = await db
      .collection("brands")
      .find({ _id: new ObjectId(_id) });
    const found = await result.toArray();
    if (found.length === 0) {
      return null;
    }
    const { _id: id, ...info } = found[0];

    return { id, ...info, models: await this.findModelsByBrandId(id) };
  };

  // Query to get all models for the brand based on id
  findModelsByBrandId = async (id) => {
    const db = await this.makeDb();
    const models = await (
      await db.collection("cars").find({ make: id })
    ).toArray();

    // Populate fuel type for every model
    await Promise.all(
      models.map(async (model, idx) => {
        models[idx].fuelType = (
          await this.findFuelTypeById(model.fuelType)
        ).name;
      })
    );
    return models;
  };

  findByName = async (brand) => {
    const db = await this.makeDb();
    const result = await db.collection("brands").find({ name: brand.name });
    const found = await result.toArray();
    if (found.length === 0) {
      return null;
    }
    const { _id: id, ...info } = found[0];

    return { id, ...info, models: await this.findModelsByBrandId(id) };
  };

  insert = async ({ ...brandInfo }) => {
    const db = await this.makeDb();
    const result = await db.collection("brands").insertOne({ ...brandInfo });
    const { _id: id, ...insertedInfo } = result.ops[0];
    return { id, ...insertedInfo };
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
