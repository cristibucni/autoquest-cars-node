const KW_TO_METRIC_HP = 1.3596216173;

class EngineDTO {
  constructor({ id, name, codes, power, size, fuel, createdOn, modifiedOn }) {
    this.id = id;
    this.name = name;
    this.codes = codes;
    this.power = power;
    this.powerHP = Math.floor(power * KW_TO_METRIC_HP);
    this.size = size;
    this.fuel = fuel;
    this.createdOn = createdOn;
    this.modifiedOn = modifiedOn;
  }
}

export default EngineDTO;
