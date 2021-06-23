class FuelType {
  constructor({ name, createdOn = Date.now(), modifiedOn = Date.now() }) {
    if (!name) {
      throw new Error("Fuel type must have a name.");
    }

    this.name = name;
    this.createdOn = createdOn;
    this.modifiedOn = modifiedOn;
  }

  getName = () => this.name;

  getCreatedOn = () => this.createdOn;

  getModifiedOn = () => this.modifiedOn;
}

export default FuelType;
