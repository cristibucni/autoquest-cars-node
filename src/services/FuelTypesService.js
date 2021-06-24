import FuelType from "../entities/FuelType";
import AbstractService from "./AbstractService";

class FuelTypesService extends AbstractService {
  addFuelType = async (fuelTypeInfo) => {
    const fuelType = new FuelType(fuelTypeInfo);
    const exists = await this.db.findById({ name: fuelType.getName() });
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
    return await this.db.findById({
      id,
    });
  };

  readFuelTypes = async (query) => {
    return await this.db.findAll(query);
  };

  removeFuelType = async ({ id } = {}) => {
    if (!id) {
      throw new Error("You must supply a fuel type id.");
    }

    const fuelTypeToDelete = await this.db.findById({ id });

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
