import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import makeCallback from "./express-callback";
import CarController from "./controllers/CarController";

dotenv.config();

const app = express();
app.use(bodyParser.json());
// TODO: figure out DNT compliance.

app.use((_, res, next) => {
  res.set({ Tk: "!" });
  next();
});

app.get("/", (req, res) => {
  res.send("Hello from CN!");
});

app.post(`/cars`, makeCallback(CarController.postCar));
app.delete(`/cars/:id`, makeCallback(CarController.deleteCar));
app.delete(`/cars`, makeCallback(CarController.deleteCar));
app.patch(`/cars/:id`, makeCallback(CarController.patchCar));
app.patch(`/cars`, makeCallback(CarController.patchCar));
app.get(`/cars/:id`, makeCallback(CarController.getCar));
app.get(`/cars`, makeCallback(CarController.getCars));

// listen for requests
app.listen(process.env.APP_PORT, () => {
  console.log(`Server is listening on port ${process.env.APP_PORT}`);
});

export default app;
