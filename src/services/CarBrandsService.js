import CarBrand from "../entities/CarBrand";
import AbstractService from "./AbstractService";

class CarsBrandService extends AbstractService {
  addBrands = async (brandsList) => {
    const brands = brandsList.map((brand) => new CarBrand({ name: brand }));

    return this.db.insertMany(
      brands.map((brand) => ({
        name: brand.getName(),
        createdOn: brand.getCreatedOn(),
        modifiedOn: brand.getModifiedOn(),
      }))
    );
  };
  addBrand = async (brandInfo) => {
    const brand = new CarBrand(brandInfo);
    const exists = await this.db.findById({ name: brand.getName() });
    if (exists) {
      return exists;
    }

    return this.db.insert({
      name: brand.getName(),
      createdOn: brand.getCreatedOn(),
      modifiedOn: brand.getModifiedOn(),
    });
  };

  readBrand = async ({ id } = {}) => {
    if (!id) {
      throw new Error("You must supply a brand id.");
    }
    return await this.db.findById({
      id,
    });
  };

  readBrands = async (query) => {
    return await this.db.findAll(query);
  };

  removeBrand = async ({ id } = {}) => {
    if (!id) {
      throw new Error("You must supply a brand id.");
    }

    const brandToDelete = await this.db.findById({ id });

    if (!this.db) {
      return {
        deletedCount: 0,
        message: "Brand not found, nothing to delete.",
      };
    }
    await this.db.remove(brandToDelete);
    return {
      deletedCount: 1,
      message: "Brand deleted.",
    };
  };
}

export default CarsBrandService;
