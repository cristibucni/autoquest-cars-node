import {
  carsDB,
  brandsDB,
  fuelTypesDB,
  enginesDB,
  vehicleTypesDB,
} from "../repository";

import Cars from "./CarsService";
import CarBrands from "./CarBrandsService";
import FuelTypes from "./FuelTypesService";
import Engines from "./EnginesService";
import VehicleTypes from "./VehicleTypesService";

const CarsService = new Cars(carsDB);
const CarBrandsService = new CarBrands(brandsDB);
const FuelTypesService = new FuelTypes(fuelTypesDB);
const EnginesService = new Engines(enginesDB);
const VehicleTypesService = new VehicleTypes(vehicleTypesDB);

export {
  CarsService,
  CarBrandsService,
  FuelTypesService,
  EnginesService,
  VehicleTypesService,
};
