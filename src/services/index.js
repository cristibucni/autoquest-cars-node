import { carsDB, brandsDB, fuelTypesDB, enginesDB } from "../repository";

import Cars from "./CarsService";
import CarBrands from "./CarBrandsService";
import FuelTypes from "./FuelTypesService";
import Engines from "./EnginesService";

const CarsService = new Cars(carsDB);
const CarBrandsService = new CarBrands(brandsDB);
const FuelTypesService = new FuelTypes(fuelTypesDB);
const EnginesService = new Engines(enginesDB);

export { CarsService, CarBrandsService, FuelTypesService, EnginesService };
