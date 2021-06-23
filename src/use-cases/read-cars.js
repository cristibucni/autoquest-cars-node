export default function makeReadCars({ carsDB }) {
  return async function readCars(query) {
    return await carsDB.findAll(query);
  };
}
