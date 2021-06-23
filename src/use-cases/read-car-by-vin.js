export default function makeReadCarByVIN({ carsDB }) {
  return async function readCarByVIN({ vin } = {}) {
    if (!vin) {
      throw new Error("You must supply a car VIN.");
    }
    return await carsDB.findByVIN({
      vin,
    });
  };
}
