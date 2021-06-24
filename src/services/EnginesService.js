import Engine from "../entities/Engine";
import AbstractService from "./AbstractService";
import { ObjectId } from "mongodb";

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
