import AbstractEntity from "./AbstractEntity";

class FuelType extends AbstractEntity {
  constructor({ name, createdOn = Date.now(), modifiedOn = Date.now() }) {
    if (!name) {
      throw new Error("Fuel type must have a name.");
    }

    super({ createdOn, modifiedOn });

    this.name = name;
  }

  getName = () => this.name;
}

export default FuelType;
