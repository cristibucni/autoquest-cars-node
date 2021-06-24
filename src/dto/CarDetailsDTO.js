class CarDetailsDTO {
  constructor({
    id,
    make,
    model,
    startYear,
    endYear,
    createdOn,
    modifiedOn,
    engines,
    vehicleTypes,
  }) {
    this.id = id;
    this.make = make;
    this.model = model;
    this.startYear = startYear;
    this.endYear = endYear;
    this.engines = engines;
    this.vehicleTypes = vehicleTypes;
    this.createdOn = createdOn;
    this.modifiedOn = modifiedOn;
  }
}

export default CarDetailsDTO;
