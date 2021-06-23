import CarsService from "../services";

class CarController {
  getCars = async (httpRequest) => {
    const headers = {
      "Content-Type": "application/json",
    };
    const query = httpRequest.query || {};
    try {
      const cars = await CarsService.readCars(query);
      return {
        headers,
        statusCode: 200,
        body: cars,
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

  getCar = async (httpRequest) => {
    const headers = {
      "Content-Type": "application/json",
    };
    try {
      const car = await CarsService.readCar({
        id: httpRequest.params.id,
      });
      return {
        headers,
        statusCode: 200,
        body: car,
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

  postCar = async (httpRequest) => {
    try {
      const { source = {}, ...carInfo } = httpRequest.body;
      source.browser = httpRequest.headers["User-Agent"];
      if (httpRequest.headers["Referer"]) {
        source.referrer = httpRequest.headers["Referer"];
      }
      const posted = await CarsService.addCar({
        ...carInfo,
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

  patchCar = async (httpRequest) => {
    try {
      const { source = {}, ...carInfo } = httpRequest.body;
      source.ip = httpRequest.ip;
      source.browser = httpRequest.headers["User-Agent"];
      if (httpRequest.headers["Referer"]) {
        source.referrer = httpRequest.headers["Referer"];
      }
      const toEdit = {
        ...carInfo,
        id: httpRequest.params.id,
      };
      const patched = await CarsService.editCar(toEdit);
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

  deleteCar = async (httpRequest) => {
    const headers = {
      "Content-Type": "application/json",
    };
    try {
      const deleted = await CarsService.removeCar({
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

export default new CarController();
