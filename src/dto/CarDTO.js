class CarDTO {
  constructor({ id, make, model, startYear, endYear, createdOn, modifiedOn }) {
    this.id = id;
    this.make = make;
    this.model = model;
    this.startYear = startYear;
    this.endYear = endYear;
    this.createdOn = createdOn;
    this.modifiedOn = modifiedOn;
  }
}

export default CarDTO;
