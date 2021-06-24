import { ObjectId } from "mongodb";
import AbstractRepository from "./AbstractRepository";

class CarsRepository extends AbstractRepository {
  findAll = async (query = {}) => {
    const db = await this.makeDb();
    const result = await db.collection("cars").find(query);
    const cars = (await result.toArray()).map(({ _id: id, ...found }) => ({
      id,
      ...found,
    }));

    //Populate brand
    await Promise.all(
      cars.map(async (car, idx) => {
        cars[idx].make = (await this.findBrandById(car.makeRef)).name;
        delete cars[idx].makeRef;
        delete cars[idx].enginesRef;
        delete cars[idx].vehicleTypesRef;
      })
    );

    return cars;
  };

  findById = async ({ id: _id }) => {
    const db = await this.makeDb();
    const result = await db
      .collection("cars")
      .findOne({ _id: new ObjectId(_id) });
    if (!result) {
      return null;
    }
    const { _id: id, ...info } = result;
    const car = {
      id,
      make: (await this.findBrandById(info.makeRef)).name,
      ...info,

      engines: await this.findEnginesByIds(info.enginesRef),
      vehicleTypes: await this.findVehicleTypesByIds(info.vehicleTypesRef),
    };
    delete car.makeRef;
    delete car.enginesRef;
    delete car.vehicleTypesRef;

    return car;
  };

  findByModel = async (car) => {
    const db = await this.makeDb();
    const result = await db.collection("cars").findOne({ model: car.model });
    if (!result) {
      return null;
    }
    const { _id: id, ...info } = result;
    return {
      id,
      make: (await this.findBrandById(info.make)).name,
      ...info,
    };
  };

  insert = async ({ ...carInfo }) => {
    const db = await this.makeDb();
    const result = await db.collection("cars").insertOne({ ...carInfo });
    const { _id: id, ...insertedInfo } = result.ops[0];
    return { id, ...insertedInfo };
  };

  update = async ({ _id, ...carInfo }) => {
    const db = await this.makeDb();
    const result = await db
      .collection("cars")
      .updateOne({ _id }, { $set: { ...carInfo } });
    return result.modifiedCount > 0 ? { id: _id, ...carInfo } : null;
  };

  remove = async ({ id: _id }) => {
    const db = await this.makeDb();
    const result = await db.collection("cars").deleteOne({ _id });
    return result.deletedCount;
  };

  // Query to get all models for the brand based on id
  findBrandById = async (brandId) => {
    const db = await this.makeDb();
    return await db
      .collection("brands")
      .findOne({ _id: new ObjectId(brandId) });
  };

  // Query to get all engines for a model based on enginesRef
  findVehicleTypesByIds = async (vehicleTypesRef) => {
    const vehicleTypes = [];

    // Populate fuel type for every model
    await Promise.all(
      vehicleTypesRef.map(async (engineRef) => {
        vehicleTypes.push(await this.findVehicleTypeById(engineRef));
      })
    );
    return vehicleTypes;
  };

  // Query to get all engines for a model based on enginesRef
  findEnginesByIds = async (enginesRef) => {
    const engines = [];

    // Populate fuel type for every model
    await Promise.all(
      enginesRef.map(async (engineRef) => {
        engines.push(await this.findEngineById(engineRef));
      })
    );
    return engines;
  };
}

export default CarsRepository;
