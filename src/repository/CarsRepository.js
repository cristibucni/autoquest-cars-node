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
        cars[idx].make = (await this.getBrandForModel(car.make)).name;
      })
    );

    //Populate fuel type
    await Promise.all(
      cars.map(async (car, idx) => {
        cars[idx].fuelType = (await this.getFuelType(car.fuelType)).name;
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
    return {
      id,
      ...info,
      make: (await this.getBrandForModel(info.make)).name,
      fuel: (await this.getFuelType(info.fuelType)).name,
    };
  };

  findByVIN = async (car) => {
    const db = await this.makeDb();
    const result = await db.collection("cars").findOne({ vin: car.vin });
    if (!result) {
      return null;
    }
    const { _id: id, ...info } = result;
    return {
      id,
      ...info,
      make: (await this.getBrandForModel(info.make)).name,
      fuel: (await this.getFuelType(info.fuelType)).name,
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
}

export default CarsRepository;
