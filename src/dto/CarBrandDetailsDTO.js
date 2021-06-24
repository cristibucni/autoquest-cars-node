class CarBrandDetailsDTO {
  constructor({ id, name, createdOn, modifiedOn, models }) {
    this.id = id;
    this.name = name;
    this.models = models;
    this.createdOn = createdOn;
    this.modifiedOn = modifiedOn;
  }
}

export default CarBrandDetailsDTO;
