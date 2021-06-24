import CarBrand from "../entities/CarBrand";
import {
  brandsDB as BrandsRepository,
  carsDB as CarsRepository,
} from "../repository";
import CarDTO from "../dto/CarDTO";
import CarBrandDetailsDTO from "../dto/CarBrandDetailsDTO";

class CarsBrandService {
  addBrands = async (brandsList) => {
    const brands = brandsList.map((brand) => new CarBrand({ name: brand }));

    return BrandsRepository.insertMany(
      brands.map((brand) => ({
        name: brand.getName(),
        createdOn: brand.getCreatedOn(),
        modifiedOn: brand.getModifiedOn(),
      }))
    );
  };
  addBrand = async (brandInfo) => {
    const brand = new CarBrand(brandInfo);
    const exists = await BrandsRepository.findById({ name: brand.getName() });
    if (exists) {
      return exists;
    }

    return BrandsRepository.insert({
      name: brand.getName(),
      createdOn: brand.getCreatedOn(),
      modifiedOn: brand.getModifiedOn(),
    });
  };

  readBrand = async ({ id } = {}) => {
    if (!id) {
      throw new Error("You must supply a brand id.");
    }
    const brand = await BrandsRepository.findById({
      id,
    });
    const models = await this.findModels(brand);

    return new CarBrandDetailsDTO({
      id: brand.id,
      name: brand.name,
      createdOn: brand.createdOn,
      modifiedOn: brand.modifiedOn,
      models,
    });
  };

  // Query to get all models for the brand based on id
  findModels = async (brand) => {
    const cars = await CarsRepository.findByBrandId(brand.id);
    return cars.map(
      (car) =>
        new CarDTO({
          id: car._id,
          model: car.model,
          modifiedOn: car.modifiedOn,
          createdOn: car.createdOn,
          endYear: car.endYear,
          startYear: car.startYear,
          make: brand.name,
        })
    );
  };

  readBrands = async (query) => {
    return await BrandsRepository.findAll(query);
  };

  removeBrand = async ({ id } = {}) => {
    if (!id) {
      throw new Error("You must supply a brand id.");
    }

    const brandToDelete = await BrandsRepository.findById({ id });

    if (!BrandsRepository) {
      return {
        deletedCount: 0,
        message: "Brand not found, nothing to delete.",
      };
    }
    await BrandsRepository.remove(brandToDelete);
    return {
      deletedCount: 1,
      message: "Brand deleted.",
    };
  };
}

export default CarsBrandService;
