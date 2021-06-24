import Engine from "../entities/Engine";
import {
  enginesDB as EnginesRepository,
  fuelTypesDB as FuelTypesRepository,
} from "../repository";
import { ObjectId } from "mongodb";
import EngineDTO from "../dto/EngineDTO";

class EnginesServiceService {
  constructor() {
    this.KW_TO_METRIC_HP = 1.3596216173;
  }

  addEngine = async (engineInfo) => {
    const engine = new Engine(engineInfo);
    const exists = await EnginesRepository.findById({
      codes: engine.getCodes(),
    });
    if (exists) {
      return exists;
    }

    return EnginesRepository.insert({
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

    const existing = await EnginesRepository.findById({ id });

    if (!existing) {
      throw new RangeError("Engine not found.");
    }
    const engine = new Engine({ ...existing, ...changes, modifiedOn: null });

    const updated = await EnginesRepository.update({
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
    const engine = await EnginesRepository.findById(id);
    return new EngineDTO({
      id: engine.id,
      name: engine.name,
      codes: engine.codes,
      power: engine.power,
      size: engine.size,
      fuel: await FuelTypesRepository.findById(engine.fuelTypeReference),
      createdOn: engine.createdOn,
      modifiedOn: engine.modifiedOn,
    });
  };

  readEngines = async (query) => {
    const engines = await EnginesRepository.findAll(query);
    return await Promise.all(
      engines.map(async (engine) => {
        const fuel = await FuelTypesRepository.findById(
          engine.fuelTypeReference
        );
        return new EngineDTO({
          id: engine.id,
          name: engine.name,
          codes: engine.codes,
          power: engine.power,
          size: engine.size,
          fuel,
          createdOn: engine.createdOn,
          modifiedOn: engine.modifiedOn,
        });
      })
    );
  };

  removeEngine = async ({ id } = {}) => {
    if (!id) {
      throw new Error("You must supply an engine id.");
    }

    const engineToDelete = await EnginesRepository.findById({ id });

    if (!EnginesRepository) {
      return {
        deletedCount: 0,
        message: "Engine not found, nothing to delete.",
      };
    }
    await EnginesRepository.remove(engineToDelete);
    return {
      deletedCount: 1,
      message: "Engine deleted.",
    };
  };
}

export default EnginesServiceService;
