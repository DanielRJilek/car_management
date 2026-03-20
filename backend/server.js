import dotenv from "dotenv";
import express from "express";
import carsRoutes from "./routes/carRoutes.js";
import salesRoutes from "./routes/salesRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import passport from "../config/passport.js";
import bcrypt from "bcrypt";
import { connectDB } from "./db/dbConn.js";

const PORT = process.env.PORT || 10000;
dotenv.config();

const app = express();
app.use(express.json());
const client = connectDB();

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Initialize Passport
app.use(passport.initialize());

app.use("/api/cars", carsRoutes(client.db("dev")));
app.use('/api/auth', authRoutes(client.db("dev")));
app.use('/api/users', userRoutes(client.db("dev")));
app.use('/api/sales', salesRoutes(client.db("dev")));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
