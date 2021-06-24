import { ObjectId } from "mongodb";

class AbstractRepository {
  makeDb;

  constructor({ makeDb }) {
    this.makeDb = makeDb;
  }

  // Query to get fuel type name based on fuelType ref
  getFuelType = async (fuelTypeId) => {
    const db = await this.makeDb();
    const result = await db
      .collection("fuelTypes")
      .findOne({ _id: new ObjectId(fuelTypeId) });
    return {
      name: result.name,
      id: result._id,
    };
  };

  // Query to get all models for the brand based on id
  getModelsForBrand = async (id) => {
    const db = await this.makeDb();
    const models = await (
      await db.collection("cars").find({ make: id })
    ).toArray();

    // Populate fuel type for every model
    await Promise.all(
      models.map(async (model, idx) => {
        models[idx].fuelType = (await this.getFuelType(model.fuelType)).name;
      })
    );
    return models;
  };

  // Query to get all models for the brand based on id
  getBrandForModel = async (brandId) => {
    const db = await this.makeDb();
    return await db
      .collection("brands")
      .findOne({ _id: new ObjectId(brandId) });
  };
}

export default AbstractRepository;
