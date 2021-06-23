export default function makeRemoveCar({ carsDB }) {
  return async function removeCar({ id } = {}) {
    if (!id) {
      throw new Error("You must supply a car id.");
    }

    const carToDelete = await carsDB.findById({ id });

    if (!carsDB) {
      return deleteNothing();
    }

    return hardDelete(carToDelete);
  };

  function deleteNothing() {
    return {
      deletedCount: 0,
      softDelete: false,
      message: "Comment not found, nothing to delete.",
    };
  }

  async function hardDelete(car) {
    await carsDB.remove(car);
    return {
      deletedCount: 1,
      message: "Car deleted.",
    };
  }
}
