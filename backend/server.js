import dotenv from "dotenv";
import express from "express";
import { MongoClient } from "mongodb";
import carsRoutes from "./routes/carRoutes.js";
import salesRoutes from "./routes/salesRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import passport from "passport";
import bcrypt from "bcrypt";
import { connectDB } from "./db/dbConn.js";

const PORT = process.env.PORT || 10000;
dotenv.config();

const app = express();
app.use(express.json());
const client = connectDB();

app.use("/api/cars", carsRoutes(db));
app.use('/api/auth', userRoutes(db));
app.use('/api/sales', salesRoutes(db));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
