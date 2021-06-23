import makeCar from "../entities/car";

export default function makeEditCar({ carsDB }) {
  return async function editCar({ id, ...changes } = {}) {
    if (!id) {
      throw new Error("You must supply an id.");
    }

    const existing = await carsDB.findById({ id });

    if (!existing) {
      throw new RangeError("Car not found.");
    }
    const car = makeCar({ ...existing, ...changes, modifiedOn: null });

    const updated = await carsDB.update({
      make: car.getMake(),
      model: car.getModel(),
      vin: car.getVin(),
      year: car.getYear(),
      fuel: car.getFuelType(),
      createdOn: car.getCreatedOn(),
      modifiedOn: car.getModifiedOn(),
    });
    return { ...existing, ...updated };
  };
}
