import { VehicleTypesService } from "../services";

class VehicleTypeController {
  getVehicleTypes = async (httpRequest) => {
    const headers = {
      "Content-Type": "application/json",
    };
    const query = httpRequest.query || {};
    try {
      const vehicleTypes = await VehicleTypesService.readVehicleTypes(query);
      return {
        headers,
        statusCode: 200,
        body: vehicleTypes,
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

  getVehicleType = async (httpRequest) => {
    const headers = {
      "Content-Type": "application/json",
    };
    try {
      const vehicleType = await VehicleTypesService.readVehicleType({
        id: httpRequest.params.id,
      });
      return {
        headers,
        statusCode: 200,
        body: vehicleType,
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

  postVehicleType = async (httpRequest) => {
    try {
      const { source = {}, ...vehicleTypeInfo } = httpRequest.body;
      source.browser = httpRequest.headers["User-Agent"];
      if (httpRequest.headers["Referer"]) {
        source.referrer = httpRequest.headers["Referer"];
      }
      const posted = await VehicleTypesService.addVehicleType({
        ...vehicleTypeInfo,
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

  patchVehicleType = async (httpRequest) => {
    try {
      const { source = {}, ...vehicleTypeInfo } = httpRequest.body;
      source.ip = httpRequest.ip;
      source.browser = httpRequest.headers["User-Agent"];
      if (httpRequest.headers["Referer"]) {
        source.referrer = httpRequest.headers["Referer"];
      }
      const toEdit = {
        ...vehicleTypeInfo,
        id: httpRequest.params.id,
      };
      const patched = await VehicleTypesService.editVehicleType(toEdit);
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

  deleteVehicleType = async (httpRequest) => {
    const headers = {
      "Content-Type": "application/json",
    };
    try {
      const deleted = await VehicleTypesService.removeVehicleType({
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

export default new VehicleTypeController();
