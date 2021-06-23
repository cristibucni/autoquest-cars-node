import { carsDB, brandsDB, fuelTypesDB } from "../repository";
import carsService from "./CarsService";
import carBrandService from "./CarBrandsService";
import fuelTypesService from "./FuelTypesService";

const CarsService = new carsService(carsDB);
const CarBrandsService = new carBrandService(brandsDB);
const FuelTypesService = new fuelTypesService(fuelTypesDB);
export { CarsService, CarBrandsService, FuelTypesService };
