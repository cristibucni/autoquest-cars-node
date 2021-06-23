import carsDB from "../data-access";
import makeCar from "../entities/car";

class CarsService {
  #carsDB;

  constructor(carsDB) {
    this.#carsDB = carsDB;
  }

  addCar = async (carInfo) => {
    const car = makeCar(carInfo);
    const exists = await this.#carsDB.findByVIN({ vin: car.getVin() });
    if (exists) {
      return exists;
    }

    return this.#carsDB.insert({
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

    const existing = await this.#carsDB.findById({ id });

    if (!existing) {
      throw new RangeError("Car not found.");
    }
    const car = makeCar({ ...existing, ...changes, modifiedOn: null });

    const updated = await this.#carsDB.update({
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
    return await this.#carsDB.findById({
      id,
    });
  };

  readCarByVIN = async ({ vin } = {}) => {
    if (!vin) {
      throw new Error("You must supply a car VIN.");
    }
    return await this.#carsDB.findByVIN({
      vin,
    });
  };

  readCars = async (query) => {
    return await this.#carsDB.findAll(query);
  };

  removeCar = async ({ id } = {}) => {
    if (!id) {
      throw new Error("You must supply a car id.");
    }

    const carToDelete = await this.#carsDB.findById({ id });

    if (!this.#carsDB) {
      return {
        deletedCount: 0,
        softDelete: false,
        message: "Car not found, nothing to delete.",
      };
    }
    await this.#carsDB.remove(carToDelete);
    return {
      deletedCount: 1,
      message: "Car deleted.",
    };
  };
}

export default new CarsService(carsDB);
