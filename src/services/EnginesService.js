import Engine from "../entities/Engine";
import AbstractService from "./AbstractService";
import { ObjectId } from "mongodb";
import VehicleType from "../entities/VehicleType";

class EnginesServiceService extends AbstractService {
  addEngine = async (engineInfo) => {
    const engine = new Engine(engineInfo);
    const exists = await this.db.findById({ codes: engine.getCodes() });
    if (exists) {
      return exists;
    }

    return this.db.insert({
      name: engine.getName(),
      codes: engine.getCodes(),
      size: engine.getSize(),
      power: engine.getPower(),
      fuelTypeReference: new ObjectId(engine.getFuelTypeReference()),
      createdOn: engine.getCreatedOn(),
      modifiedOn: engine.getModifiedOn(),
    });
  };

  editEngine = async ({ id, ...changes } = {}) => {
    if (!id) {
      throw new Error("You must supply an id.");
    }

    const existing = await this.db.findById({ id });

    if (!existing) {
      throw new RangeError("Engine not found.");
    }
    const engine = new Engine({ ...existing, ...changes, modifiedOn: null });

    const updated = await this.db.update({
      name: engine.getName(),
      codes: engine.getCodes(),
      power: engine.getPower(),
      size: engine.getSize(),
      fuelTypeReference: engine.getFuelTypeReference(),
      createdOn: engine.getCreatedOn(),
      modifiedOn: engine.getModifiedOn(),
    });
    return { ...existing, ...updated };
  };

  readEngine = async ({ id } = {}) => {
    if (!id) {
      throw new Error("You must supply an engine id.");
    }
    return await this.db.findById({
      id,
    });
  };

  readEngines = async (query) => {
    return await this.db.findAll(query);
  };

  removeEngine = async ({ id } = {}) => {
    if (!id) {
      throw new Error("You must supply an engine id.");
    }

    const engineToDelete = await this.db.findById({ id });

    if (!this.db) {
      return {
        deletedCount: 0,
        message: "Engine not found, nothing to delete.",
      };
    }
    await this.db.remove(engineToDelete);
    return {
      deletedCount: 1,
      message: "Engine deleted.",
    };
  };
}

export default EnginesServiceService;
