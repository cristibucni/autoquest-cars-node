import { CarBrandsService } from "../services";

class CarBrandController {
  getBrands = async (httpRequest) => {
    const headers = {
      "Content-Type": "application/json",
    };
    const query = httpRequest.query || {};
    try {
      const brands = await CarBrandsService.readBrands(query);
      return {
        headers,
        statusCode: 200,
        body: brands,
      };
    } catch (e) {
      // TODO: Error logging
      console.log(e);
      return {
        headers,
        statusCode: 400,
        body: {
          error: e.message,
        },
      };
    }
  };

  getBrand = async (httpRequest) => {
    const headers = {
      "Content-Type": "application/json",
    };
    try {
      const brand = await CarBrandsService.readBrand({
        id: httpRequest.params.id,
      });
      return {
        headers,
        statusCode: 200,
        body: brand,
      };
    } catch (e) {
      // TODO: Error logging
      console.log(e);
      return {
        headers,
        statusCode: 400,
        body: {
          error: e.message,
        },
      };
    }
  };

  postBrand = async (httpRequest) => {
    try {
      const { source = {}, ...brandInfo } = httpRequest.body;
      source.browser = httpRequest.headers["User-Agent"];
      if (httpRequest.headers["Referer"]) {
        source.referrer = httpRequest.headers["Referer"];
      }
      const posted = await CarBrandsService.addBrand({
        ...brandInfo,
      });
      return {
        headers: {
          "Content-Type": "application/json",
          "Last-Modified": new Date(posted.modifiedOn).toUTCString(),
        },
        statusCode: 201,
        body: { posted },
      };
    } catch (e) {
      // TODO: Error logging
      console.log(e);

      return {
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: 400,
        body: {
          error: e.message,
        },
      };
    }
  };

  postBrands = async (httpRequest) => {
    try {
      const brands = httpRequest.body;
      const posted = await CarBrandsService.addBrands(brands);
      return {
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: 201,
        body: { posted },
      };
    } catch (e) {
      // TODO: Error logging
      console.log(e);

      return {
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: 400,
        body: {
          error: e.message,
        },
      };
    }
  };

  patchBrand = async (httpRequest) => {
    try {
      const { source = {}, ...brandInfo } = httpRequest.body;
      source.ip = httpRequest.ip;
      source.browser = httpRequest.headers["User-Agent"];
      if (httpRequest.headers["Referer"]) {
        source.referrer = httpRequest.headers["Referer"];
      }
      const toEdit = {
        ...brandInfo,
        id: httpRequest.params.id,
      };
      const patched = await CarBrandsService.editCar(toEdit);
      return {
        headers: {
          "Content-Type": "application/json",
          "Last-Modified": new Date(patched.modifiedOn).toUTCString(),
        },
        statusCode: 200,
        body: { patched },
      };
    } catch (e) {
      // TODO: Error logging
      console.log(e);
      if (e.name === "RangeError") {
        return {
          headers: {
            "Content-Type": "application/json",
          },
          statusCode: 404,
          body: {
            error: e.message,
          },
        };
      }
      return {
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: 400,
        body: {
          error: e.message,
        },
      };
    }
  };

  deleteBrand = async (httpRequest) => {
    const headers = {
      "Content-Type": "application/json",
    };
    try {
      const deleted = await CarBrandsService.removeBrand({
        id: httpRequest.params.id,
      });
      return {
        headers,
        statusCode: deleted.deletedCount === 0 ? 404 : 200,
        body: { deleted },
      };
    } catch (e) {
      // TODO: Error logging
      console.log(e);
      return {
        headers,
        statusCode: 400,
        body: {
          error: e.message,
        },
      };
    }
  };
}

export default new CarBrandController();
