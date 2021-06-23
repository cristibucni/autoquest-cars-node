import makeCar from "../entities/car";

export default function makeAddCar({ carsDB }) {
  return async function addCar(carInfo) {
    const car = makeCar(carInfo);
    const exists = await carsDB.findByVIN({ vin: car.getVin() });
    if (exists) {
      return exists;
    }

    return carsDB.insert({
      make: car.getMake(),
      model: car.getModel(),
      vin: car.getVin(),
      year: car.getYear(),
      fuel: car.getFuelType(),
      createdOn: car.getCreatedOn(),
      modifiedOn: car.getModifiedOn(),
    });
  };
}
