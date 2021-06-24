import VehicleType from "../entities/VehicleType";
import AbstractService from "./AbstractService";

class VehicleTypesService extends AbstractService {
  addVehicleType = async (vehicleTypeInfo) => {
    const vehicleType = new VehicleType(vehicleTypeInfo);
    const exists = await this.db.findById({ name: vehicleType.getName() });
    if (exists) {
      return exists;
    }

    return this.db.insert({
      name: vehicleType.getName(),
      createdOn: vehicleType.getCreatedOn(),
      modifiedOn: vehicleType.getModifiedOn(),
    });
  };

  editVehicleType = async ({ id, ...changes } = {}) => {
    if (!id) {
      throw new Error("You must supply an id.");
    }

    const existing = await this.db.findById({ id });

    if (!existing) {
      throw new RangeError("Vehicle type not found.");
    }
    const vehicleType = new VehicleType({
      ...existing,
      ...changes,
      modifiedOn: null,
    });

    const updated = await this.db.update({
      name: vehicleType.getName(),
      createdOn: vehicleType.getCreatedOn(),
      modifiedOn: vehicleType.getModifiedOn(),
    });
    return { ...existing, ...updated };
  };

  readVehicleType = async ({ id } = {}) => {
    if (!id) {
      throw new Error("You must supply a vehicle type id.");
    }
    return await this.db.findById({
      id,
    });
  };

  readVehicleTypes = async (query) => {
    return await this.db.findAll(query);
  };

  removeVehicleType = async ({ id } = {}) => {
    if (!id) {
      throw new Error("You must supply an vehicle type id.");
    }

    const vehicleTypeToDelete = await this.db.findById({ id });

    if (!this.db) {
      return {
        deletedCount: 0,
        message: "Vehicle type not found, nothing to delete.",
      };
    }
    await this.db.remove(vehicleTypeToDelete);
    return {
      deletedCount: 1,
      message: "VehicleType deleted.",
    };
  };
}

export default VehicleTypesService;
