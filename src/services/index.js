import { carsDB, brandsDB } from "../repository";
import carsService from "./CarsService";
import carBrandService from "./CarBrandsService";

const CarsService = new carsService(carsDB);
const CarBrandsService = new carBrandService(brandsDB);
export { CarsService, CarBrandsService };
