import Car from "../entities/Car";
import AbstractService from "./AbstractService";

class CarsService extends AbstractService {
  addCar = async (carInfo) => {
    const car = new Car(carInfo);
    const exists = await this.db.findByVIN({ vin: car.getVin() });
    if (exists) {
      return exists;
    }

    return this.db.insert({
      make: car.getMake(),
      model: car.getModel(),
      vin: car.getVin(),
      year: car.getYear(),
      fuel: car.getFuelType(),
      createdOn: car.getCreatedOn(),
      modifiedOn: car.getModifiedOn(),
    });
  };

  editCar = async ({ id, ...changes } = {}) => {
    if (!id) {
      throw new Error("You must supply an id.");
    }

    const existing = await this.db.findById({ id });

    if (!existing) {
      throw new RangeError("Car not found.");
    }
    const car = new Car({ ...existing, ...changes, modifiedOn: null });

    const updated = await this.db.update({
      make: car.getMake(),
      model: car.getModel(),
      vin: car.getVin(),
      year: car.getYear(),
      fuel: car.getFuelType(),
      createdOn: car.getCreatedOn(),
      modifiedOn: car.getModifiedOn(),
    });
    return { ...existing, ...updated };
  };

  readCar = async ({ id } = {}) => {
    if (!id) {
      throw new Error("You must supply a car id.");
    }
    return await this.db.findById({
      id,
    });
  };

  readCarByVIN = async ({ vin } = {}) => {
    if (!vin) {
      throw new Error("You must supply a car VIN.");
    }
    return await this.db.findByVIN({
      vin,
    });
  };

  readCars = async (query) => {
    return await this.db.findAll(query);
  };

  removeCar = async ({ id } = {}) => {
    if (!id) {
      throw new Error("You must supply a car id.");
    }

    const carToDelete = await this.db.findById({ id });

    if (!this.db) {
      return {
        deletedCount: 0,
        softDelete: false,
        message: "Car not found, nothing to delete.",
      };
    }
    await this.db.remove(carToDelete);
    return {
      deletedCount: 1,
      message: "Car deleted.",
    };
  };
}

export default CarsService;
