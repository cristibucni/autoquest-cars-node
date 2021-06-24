import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import makeCallback from "./express-callback";
import CarController from "./controllers/CarController";
import CarBrandController from "./controllers/CarBrandController";
import FuelTypeController from "./controllers/FuelTypeController";
import EngineController from "./controllers/EngineController";
import VehicleTypeController from "./controllers/VehicleTypeController";

dotenv.config();

const app = express();
app.use(bodyParser.json());
// TODO: figure out DNT compliance.

app.use((_, res, next) => {
  res.set({ Tk: "!" });
  next();
});

app.get("/", (req, res) => {
  res.send("Hello from CN!");
});

// Cars
app.post(`/cars`, makeCallback(CarController.postCar));
app.delete(`/cars/:id`, makeCallback(CarController.deleteCar));
app.delete(`/cars`, makeCallback(CarController.deleteCar));
app.patch(`/cars/:id`, makeCallback(CarController.patchCar));
app.patch(`/cars`, makeCallback(CarController.patchCar));
app.get(`/cars/:id`, makeCallback(CarController.getCar));
app.get(`/cars`, makeCallback(CarController.getCars));

// Car Brands
app.post(`/brands`, makeCallback(CarBrandController.postBrand));
app.delete(`/brands/:id`, makeCallback(CarBrandController.deleteBrand));
app.delete(`/brands`, makeCallback(CarBrandController.deleteBrand));
app.patch(`/brands/:id`, makeCallback(CarBrandController.patchBrand));
app.patch(`/brands`, makeCallback(CarBrandController.patchBrand));
app.get(`/brands/:id`, makeCallback(CarBrandController.getBrand));
app.get(`/brands`, makeCallback(CarBrandController.getBrands));

// Fuel Types
app.get(`/fuel_types/:id`, makeCallback(FuelTypeController.getFuelType));
app.get(`/fuel_types`, makeCallback(FuelTypeController.getFuelTypes));
app.post(`/fuel_types`, makeCallback(FuelTypeController.postFuelType));
app.delete(`/fuel_types/:id`, makeCallback(FuelTypeController.deleteFuelType));
app.delete(`/fuel_types`, makeCallback(FuelTypeController.deleteFuelType));
app.patch(`/fuel_types/:id`, makeCallback(FuelTypeController.patchFuelType));
app.patch(`/fuel_types`, makeCallback(FuelTypeController.patchFuelType));

// Engines
app.get(`/engines/:id`, makeCallback(EngineController.getEngine));
app.get(`/engines`, makeCallback(EngineController.getEngines));
app.post(`/engines`, makeCallback(EngineController.postEngine));
app.delete(`/engines/:id`, makeCallback(EngineController.deleteEngine));
app.delete(`/engines`, makeCallback(EngineController.deleteEngine));
app.patch(`/engines/:id`, makeCallback(EngineController.patchEngine));
app.patch(`/engines`, makeCallback(EngineController.patchEngine));

// Vehicle Types
app.get(
  `/vehicle_types/:id`,
  makeCallback(VehicleTypeController.getVehicleType)
);
app.get(`/vehicle_types`, makeCallback(VehicleTypeController.getVehicleTypes));
app.post(`/vehicle_types`, makeCallback(VehicleTypeController.postVehicleType));
app.delete(
  `/vehicle_types/:id`,
  makeCallback(VehicleTypeController.deleteVehicleType)
);
app.delete(
  `/vehicle_types`,
  makeCallback(VehicleTypeController.deleteVehicleType)
);
app.patch(
  `/vehicle_types/:id`,
  makeCallback(VehicleTypeController.patchVehicleType)
);
app.patch(
  `/vehicle_types`,
  makeCallback(VehicleTypeController.patchVehicleType)
);

// listen for requests
app.listen(process.env.APP_PORT, () => {
  console.log(`Server is listening on port ${process.env.APP_PORT}`);
});

export default app;
