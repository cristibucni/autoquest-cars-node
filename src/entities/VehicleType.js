import AbstractEntity from "./AbstractEntity";

class VehicleType extends AbstractEntity {
  constructor({ name, createdOn = Date.now(), modifiedOn = Date.now() }) {
    if (!name) {
      throw new Error("Vehicle type must have a name.");
    }

    super({ createdOn, modifiedOn });

    this.name = name;
  }

  getName = () => this.name;
}

export default VehicleType;
