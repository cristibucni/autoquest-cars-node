export default function makeReadCar({ carsDB }) {
  return async function readCar({ id } = {}) {
    if (!id) {
      throw new Error("You must supply a car id.");
    }
    return await carsDB.findById({
      id,
    });
  };
}
