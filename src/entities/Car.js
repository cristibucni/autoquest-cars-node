import AbstractEntity from "./AbstractEntity";

class Car extends AbstractEntity {
  constructor({
    makeRef,
    model,
    enginesRef,
    vehicleTypesRef,
    startYear,
    endYear = null,
    createdOn = Date.now(),
    modifiedOn = Date.now(),
  }) {
    if (!makeRef) {
      throw new Error("Car must have a make.");
    }
    if (!model) {
      throw new Error("Car must have a model.");
    }
    if (!enginesRef) {
      throw new Error("Car must have at least one engine.");
    }
    if (!vehicleTypesRef) {
      throw new Error("Car must have at least one vehicle type.");
    }
    if (!startYear) {
      throw new Error("Car must have a start year.");
    }

    super({ createdOn, modifiedOn });

    this.makeRef = makeRef;
    this.model = model;
    this.enginseRef = enginesRef;
    this.vehicleTypesRef = vehicleTypesRef;
    this.startYear = startYear;
    this.endYear = endYear;
  }

  getMakeRef = () => this.makeRef;

  getModel = () => this.model;

  getEnginesRef = () => this.enginseRef;

  getVehicleTypesRef = () => this.vehicleTypesRef;

  getStartYear = () => this.startYear;

  getEndYear = () => this.endYear;
}

export default Car;
