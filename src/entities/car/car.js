export default function buildMakeCar() {
  return function makeCar({
    make,
    model,
    year,
    vin,
    fuel,
    createdOn = Date.now(),
    modifiedOn = Date.now(),
  } = {}) {
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
    if (!fuel) {
      throw new Error("Car must have a fuel type.");
    }

    return Object.freeze({
      getMake: () => make,
      getModel: () => model,
      getCreatedOn: () => createdOn,
      getModifiedOn: () => modifiedOn,
      getVin: () => vin,
      getYear: () => year,
      getFuelType: () => fuel,
    });
  };
}
