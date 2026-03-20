import express from "express";
import * as controller from "../controllers/salesController.js";

export default function salesRoutes(db) {
    const router = express.Router();

    // Get all sales
    router.get("/", controller.getAllSales);

    // Get sale by ID
    router.get("/:id", controller.getSaleById);

    // Get sales by car ID
    router.get("/car/:carId", controller.getSalesByCarId);

    // Create a new sale
    router.post("/", controller.createSale);

    // Update a sale
    router.put("/:id", controller.updateSale);

    // Delete a sale
    router.delete("/:id", controller.deleteSale);

    return router;
}