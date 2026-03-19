import express from "express";
import { ObjectId } from "mongodb";

export default function carsRoutes(db) {
  const router = express.Router();

  router.get("/", async (req, res) => {
    try {
      const cars = await db.collection("cars").find().toArray();
      res.json(cars);
    } catch (error) {
      res.status(500).json({ error: "Error fetching cars" });
    }
  });

  router.post("/", async (req, res) => {
    try {
      const { make, model, year, price } = req.body;

      if (!make || !model || !year || !price) {
        return res.status(400).json({ error: "Missing fields" });
      }

      const newCar = {
        make,
        model,
        year,
        price,
        mileage: 30000,
        status: "Available",
      };

      const result = await db.collection("cars").insertOne(newCar);

      res.status(201).json({
        message: "Car added",
        id: result.insertedId,
      });
    } catch (error) {
      res.status(500).json({ error: "Error adding car" });
    }
  });

  router.put("/:id", async (req, res) => {
    try {
      const id = req.params.id;

      const result = await db.collection("cars").updateOne(
        { _id: Number(id) },
        {
          $set: {
            make: req.body.make,
            model: req.body.model,
            year: req.body.year,
            price: req.body.price,
            status: req.body.status,
          },
        },
      );

      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error updating car");
    }
  });

  router.delete("/:id", async (req, res) => {
    try {
      const { id } = req.params;

      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }

      const result = await db.collection("cars").deleteOne({
        _id: new ObjectId(id),
      });

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: "Car not found" });
      }

      res.json({ message: "Car deleted" });
    } catch (error) {
      res.status(500).json({ error: "Error deleting car" });
    }
  });

  return router;
}
