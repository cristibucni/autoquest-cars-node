import AbstractEntity from "./AbstractEntity";

class CarBrand extends AbstractEntity {
  constructor({ name, createdOn = Date.now(), modifiedOn = Date.now() }) {
    if (!name) {
      throw new Error("Brand must have a name.");
    }

    super({ createdOn, modifiedOn });

    this.name = name;
  }

  getName = () => this.name;
}

export default CarBrand;
