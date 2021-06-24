import Car from "../entities/Car";
import AbstractService from "./AbstractService";
import { ObjectId } from "mongodb";

class CarsService extends AbstractService {
  addCar = async (carInfo) => {
    const car = new Car(carInfo);
    const exists = await this.db.findByModel({ model: car.getModel() });
    if (exists) {
      return exists;
    }

    return this.db.insert({
      makeRef: new ObjectId(car.getMakeRef()),
      model: car.getModel(),
      enginesRef: car
        .getEnginesRef()
        .map((engineRef) => new ObjectId(engineRef)),
      vehicleTypesRef: car
        .getVehicleTypesRef()
        .map((vehicleTypeRef) => new ObjectId(vehicleTypeRef)),
      startYear: car.getStartYear(),
      endYear: car.getEndYear(),
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
      makeRef: new ObjectId(car.getMakeRef()),
      model: car.getModel(),
      enginesRef: car
        .getEnginesRef()
        .map((engineRef) => new ObjectId(engineRef)),
      vehicleTypesRef: car
        .getVehicleTypesRef()
        .map((vehicleTypeRef) => new ObjectId(vehicleTypeRef)),
      startYear: car.getStartYear(),
      endYear: car.getEndYear(),
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
