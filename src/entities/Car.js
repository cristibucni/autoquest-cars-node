import AbstractEntity from "./AbstractEntity";

class Car extends AbstractEntity {
  constructor({
    make,
    model,
    year,
    vin,
    fuelType,
    createdOn = Date.now(),
    modifiedOn = Date.now(),
  }) {
    if (!make) {
      throw new Error("Car must have a make.");
    }
    if (!model) {
      throw new Error("Car must have a model.");
    }
    if (!vin) {
      throw new Error("Car must have a vin.");
    }
    if (!year) {
      throw new Error("Car must have a year.");
    }
    if (!fuelType) {
      throw new Error("Car must have a fuel type.");
    }

    super({ createdOn, modifiedOn });

    this.make = make;
    this.model = model;
    this.year = year;
    this.vin = vin;
    this.fuelType = fuelType;
  }

  getMake = () => this.make;

  getModel = () => this.model;

  getVin = () => this.vin;

  getYear = () => this.year;

  getFuelType = () => this.fuelType;
}

export default Car;
