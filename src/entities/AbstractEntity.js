class AbstractEntity {
  constructor({ createdOn = Date.now(), modifiedOn = Date.now() }) {
    this.createdOn = createdOn;
    this.modifiedOn = modifiedOn;
  }

  getCreatedOn = () => this.createdOn;

  getModifiedOn = () => this.modifiedOn;
}

export default AbstractEntity;
