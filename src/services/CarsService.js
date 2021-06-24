import Car from "../entities/Car";
import {
  brandsDB as BrandsRepository,
  carsDB as CarsRepository,
  enginesDB as EnginesRepository,
  fuelTypesDB as FuelTypesRepository,
  vehicleTypesDB as VehicleTypesRepository,
} from "../repository";
import { ObjectId } from "mongodb";
import CarDetailsDTO from "../dto/CarDetailsDTO";
import CarDTO from "../dto/CarDTO";

class CarsService {
  addCar = async (carInfo) => {
    const car = new Car(carInfo);
    const exists = await CarsRepository.findByModel({ model: car.getModel() });
    if (exists) {
      return exists;
    }

    return CarsRepository.insert({
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

    const existing = await CarsRepository.findById({ id });

    if (!existing) {
      throw new RangeError("Car not found.");
    }
    const car = new Car({ ...existing, ...changes, modifiedOn: null });

    const updated = await CarsRepository.update({
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
    const car = await CarsRepository.findById({
      id,
    });

    return new CarDetailsDTO({
      id: car.id,
      make: await this.findBrandById(car.makeRef),
      model: car.model,
      createdOn: car.createdOn,
      modifiedOn: car.modifiedOn,
      vehicleTypes: await this.findVehicleTypesByIds(car.vehicleTypesRef),
      startYear: car.startYear,
      endYear: car.endYear,
      engines: await this.findEnginesByIds(car.enginesRef),
    });
  };

  findBrandById = async (brandId) => {
    return (await BrandsRepository.findById({ id: brandId })).name;
  };

  // Query to get all engines for a model based on enginesRef
  findVehicleTypesByIds = async (vehicleTypesRef) => {
    const vehicleTypes = [];

    // Populate fuel type for every model
    await Promise.all(
      vehicleTypesRef.map(async (engineRef) => {
        vehicleTypes.push(await VehicleTypesRepository.findById(engineRef));
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
        const engine = await EnginesRepository.findById(engineRef);
        engine.fuel = await FuelTypesRepository.findById(
          engine.fuelTypeReference
        );
        delete engine.fuelTypeReference;
        engines.push(engine);
      })
    );
    return engines;
  };

  readCars = async (query) => {
    const res = await CarsRepository.findAll(query);
    return await Promise.all(
      res.map(async (car) => {
        const brand = await this.findBrandById(car.makeRef);
        return new CarDTO({
          id: car.id,
          make: brand,
          model: car.model,
          startYear: car.startYear,
          endYear: car.endYear,
          createdOn: car.createdOn,
          modifiedOn: car.modifiedOn,
        });
      })
    );
  };

  removeCar = async ({ id } = {}) => {
    if (!id) {
      throw new Error("You must supply a car id.");
    }

    const carToDelete = await CarsRepository.findById({ id });

    if (!CarsRepository) {
      return {
        deletedCount: 0,
        softDelete: false,
        message: "Car not found, nothing to delete.",
      };
    }
    await CarsRepository.remove(carToDelete);
    return {
      deletedCount: 1,
      message: "Car deleted.",
    };
  };
}

export default CarsService;
