import FuelType from "../entities/FuelType";
import AbstractService from "./AbstractService";

class FuelTypesService extends AbstractService {
  addFuelType = async (fuelTypeInfo) => {
    const fuelType = new FuelType(fuelTypeInfo);
    const exists = await this.db.findByName(fuelType.getName());
    if (exists) {
      return exists;
    }

    return this.db.insert({
      name: fuelType.getName(),
      createdOn: fuelType.getCreatedOn(),
      modifiedOn: fuelType.getModifiedOn(),
    });
  };

  readFuelType = async ({ id } = {}) => {
    if (!id) {
      throw new Error("You must supply a fuel type id.");
    }
    return await this.db.findFuelTypeById(id);
  };

  readFuelTypes = async (query) => {
    return await this.db.findAll(query);
  };

  editFuelType = async ({ id, ...changes } = {}) => {
    if (!id) {
      throw new Error("You must supply an id.");
    }

    const existing = await this.db.findFuelTypeById(id);

    if (!existing) {
      throw new RangeError("Fuel type not found.");
    }
    const fuelType = new FuelType({
      ...existing,
      ...changes,
      modifiedOn: Date.now(),
    });

    const updated = await this.db.update({
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

    const fuelTypeToDelete = await this.db.findFuelTypeById(id);

    if (!this.db) {
      return {
        deletedCount: 0,
        message: "Fuel type not found, nothing to delete.",
      };
    }
    await this.db.remove(fuelTypeToDelete);
    return {
      deletedCount: 1,
      message: "Fuel type deleted.",
    };
  };
}

export default FuelTypesService;
