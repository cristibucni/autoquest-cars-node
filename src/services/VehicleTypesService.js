import VehicleType from "../entities/VehicleType";
import { vehicleTypesDB as VehicleTypesRepository } from "../repository";

class VehicleTypesService {
  addVehicleType = async (vehicleTypeInfo) => {
    const vehicleType = new VehicleType(vehicleTypeInfo);
    const exists = await VehicleTypesRepository.findById(id);
    if (exists) {
      return exists;
    }

    return VehicleTypesRepository.insert({
      name: vehicleType.getName(),
      createdOn: vehicleType.getCreatedOn(),
      modifiedOn: vehicleType.getModifiedOn(),
    });
  };

  editVehicleType = async ({ id, ...changes } = {}) => {
    if (!id) {
      throw new Error("You must supply an id.");
    }

    const existing = await VehicleTypesRepository.findById(id);

    if (!existing) {
      throw new RangeError("Vehicle type not found.");
    }
    const vehicleType = new VehicleType({
      ...existing,
      ...changes,
      modifiedOn: null,
    });

    const updated = await VehicleTypesRepository.update({
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
    return await VehicleTypesRepository.findById(id);
  };

  readVehicleTypes = async (query) => {
    return await VehicleTypesRepository.findAll(query);
  };

  removeVehicleType = async ({ id } = {}) => {
    if (!id) {
      throw new Error("You must supply an vehicle type id.");
    }

    const vehicleTypeToDelete = await VehicleTypesRepository.findById(id);

    if (!VehicleTypesRepository) {
      return {
        deletedCount: 0,
        message: "Vehicle type not found, nothing to delete.",
      };
    }
    await VehicleTypesRepository.remove(vehicleTypeToDelete);
    return {
      deletedCount: 1,
      message: "VehicleType deleted.",
    };
  };
}

export default VehicleTypesService;
