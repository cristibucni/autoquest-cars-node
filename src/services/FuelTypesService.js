import FuelType from "../entities/FuelType";
import { fuelTypesDB as FuelTypesRepository } from "../repository";

class FuelTypesService {
  addFuelType = async (fuelTypeInfo) => {
    const fuelType = new FuelType(fuelTypeInfo);
    const exists = await FuelTypesRepository.findByName(fuelType.getName());
    if (exists) {
      return exists;
    }

    return FuelTypesRepository.insert({
      name: fuelType.getName(),
      createdOn: fuelType.getCreatedOn(),
      modifiedOn: fuelType.getModifiedOn(),
    });
  };

  readFuelType = async ({ id } = {}) => {
    if (!id) {
      throw new Error("You must supply a fuel type id.");
    }
    return await FuelTypesRepository.findById(id);
  };

  readFuelTypes = async (query) => {
    return await FuelTypesRepository.findAll(query);
  };

  editFuelType = async ({ id, ...changes } = {}) => {
    if (!id) {
      throw new Error("You must supply an id.");
    }

    const existing = await FuelTypesRepository.findById(id);

    if (!existing) {
      throw new RangeError("Fuel type not found.");
    }
    const fuelType = new FuelType({
      ...existing,
      ...changes,
      modifiedOn: Date.now(),
    });

    const updated = await FuelTypesRepository.update({
      _id: existing.id,
      name: fuelType.getName(),
      createdOn: fuelType.getCreatedOn(),
      modifiedOn: fuelType.getModifiedOn(),
    });

    return { ...existing, ...updated };
  };

  removeFuelType = async ({ id } = {}) => {
    if (!id) {
      throw new Error("You must supply a fuel type id.");
    }

    const fuelTypeToDelete = await FuelTypesRepository.findById(id);

    if (!FuelTypesRepository) {
      return {
        deletedCount: 0,
        message: "Fuel type not found, nothing to delete.",
      };
    }
    await FuelTypesRepository.remove(fuelTypeToDelete);
    return {
      deletedCount: 1,
      message: "Fuel type deleted.",
    };
  };
}

export default FuelTypesService;
