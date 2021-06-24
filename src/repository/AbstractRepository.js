import { ObjectId } from "mongodb";

class AbstractRepository {
  makeDb;

  constructor({ makeDb }) {
    this.makeDb = makeDb;
    this.KW_TO_METRIC_HP = 1.3596216173;
  }

  // Query to get fuel type name based on fuelType ref
  findFuelTypeById = async (fuelTypeId) => {
    const db = await this.makeDb();
    const result = await db
      .collection("fuelTypes")
      .findOne({ _id: new ObjectId(fuelTypeId) });
    return {
      name: result.name,
      id: result._id,
      createdOn: result.createdOn,
      modifiedOn: result.modifiedOn,
    };
  };

  // Query to get engine by engineRef
  findEngineById = async (engineRef) => {
    const db = await this.makeDb();
    const engine = await db
      .collection("engines")
      .findOne({ _id: new ObjectId(engineRef) });
    engine.fuel = await this.findFuelTypeById(engine.fuelTypeReference);
    engine.powerHP = Math.floor(this.KW_TO_METRIC_HP * engine.power);

    return engine;
  };

  // Query to get engine by engineRef
  findVehicleTypeById = async (vehicleTypeRef) => {
    const db = await this.makeDb();
    return await db
      .collection("vehicleTypes")
      .findOne({ _id: new ObjectId(vehicleTypeRef) });
  };
}

export default AbstractRepository;
