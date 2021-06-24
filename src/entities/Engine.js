import AbstractEntity from "./AbstractEntity";

class Engine extends AbstractEntity {
  constructor({
    name,
    codes,
    fuelTypeReference,
    power,
    size,
    createdOn = Date.now(),
    modifiedOn = Date.now(),
  }) {
    if (!name) {
      throw new Error("Engine must have a name.");
    }
    if (!codes) {
      throw new Error("Engine must have at least one code.");
    }
    if (!fuelTypeReference) {
      throw new Error("Engine must have a fuel type.");
    }
    if (!power) {
      throw new Error("Engine must have a power value.");
    }
    if (!size) {
      throw new Error("Engine must have a size.");
    }

    super({ createdOn, modifiedOn });

    this.name = name;
    this.codes = codes;
    this.power = power;
    this.fuelTypeReference = fuelTypeReference;
    this.size = size;
  }

  getName = () => this.name;
  getCodes = () => this.codes;
  getFuelTypeReference = () => this.fuelTypeReference;
  getPower = () => this.power;
  getSize = () => this.size;
}

export default Engine;
