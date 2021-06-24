class AbstractRepository {
  makeDb;

  constructor({ makeDb }) {
    this.makeDb = makeDb;
  }
}

export default AbstractRepository;
