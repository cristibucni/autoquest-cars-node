import { EnginesService } from "../services";

class EngineController {
  getEngines = async (httpRequest) => {
    const headers = {
      "Content-Type": "application/json",
    };
    const query = httpRequest.query || {};
    try {
      const engines = await EnginesService.readEngines(query);
      return {
        headers,
        statusCode: 200,
        body: engines,
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

  getEngine = async (httpRequest) => {
    const headers = {
      "Content-Type": "application/json",
    };
    try {
      const engine = await EnginesService.readEngine({
        id: httpRequest.params.id,
      });
      return {
        headers,
        statusCode: 200,
        body: engine,
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

  postEngine = async (httpRequest) => {
    try {
      const { source = {}, ...engineInfo } = httpRequest.body;
      source.browser = httpRequest.headers["User-Agent"];
      if (httpRequest.headers["Referer"]) {
        source.referrer = httpRequest.headers["Referer"];
      }
      const posted = await EnginesService.addEngine({
        ...engineInfo,
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

  patchEngine = async (httpRequest) => {
    try {
      const { source = {}, ...engineInfo } = httpRequest.body;
      source.ip = httpRequest.ip;
      source.browser = httpRequest.headers["User-Agent"];
      if (httpRequest.headers["Referer"]) {
        source.referrer = httpRequest.headers["Referer"];
      }
      const toEdit = {
        ...engineInfo,
        id: httpRequest.params.id,
      };
      const patched = await EnginesService.editCar(toEdit);
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

  deleteEngine = async (httpRequest) => {
    const headers = {
      "Content-Type": "application/json",
    };
    try {
      const deleted = await EnginesService.removeEngine({
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

export default new EngineController();
