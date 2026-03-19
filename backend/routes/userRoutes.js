import express from "express";
import { ObjectId } from "mongodb";

export default function userRoutes(db) {
    const router = express.Router();

    router.get("/", async (req, res) => {
    const cities = await db.collection("cities").find({}).toArray();
    res.json(cities);
  });
  return router;
}
