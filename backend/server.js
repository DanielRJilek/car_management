import dotenv from "dotenv";
import express from "express";
import { MongoClient } from "mongodb";
import carsRoutes from "./routes/carRoutes.js";
import salesRoutes from "./routes/salesRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import passport from "passport";

import bcrypt from "bcrypt";


dotenv.config();

const app = express();

app.use(express.json());

const PORT = 3000;
const MONGO_URL = "mongodb://127.0.0.1:27017";
const DB_NAME = "carDB";
const client = new MongoClient(MONGO_URL);

let db;

async function connectDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    db = client.db(DB_NAME);
  } catch (error) {
    console.error("MongoDB connection failed", error);
  }
}

await connectDB();

app.use("/api/cars", carsRoutes(db));
app.use('/api/auth', userRoutes(db));
app.use('/api/sales', salesRoutes(db));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
