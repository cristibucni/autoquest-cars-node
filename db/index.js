import { makeDb } from "../src/repository";
import dotenv from "dotenv";
dotenv.config();
(async function setupDb() {
  console.log("Setting up database...");
  const db = await makeDb();
  await db.collection("cars");
  console.log("Database setup complete...");
  process.exit();
})();
