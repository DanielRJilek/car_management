import { getDB } from "../db/dbConn.js";
import { ObjectId } from "mongodb";

// Get all sales
export const getAllSales = async (req, res) => {
    try {
        const db = getDB();
        const sales = await db.collection("sales").find({}).toArray();
        res.json(sales);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error fetching sales", error: err });
    }
};

// Get sale by ID
export const getSaleById = async (req, res) => {
    try {
        const db = getDB();
        const { id } = req.params;
        
        let filter;
        try {
            filter = { _id: new ObjectId(id) };
        } catch (e) {
            filter = { _id: id };
        }
        
        const sale = await db.collection("sales").findOne(filter);
        
        if (!sale) {
            return res.status(404).json({ message: "Sale not found" });
        }
        
        res.json(sale);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error fetching sale", error: err });
    }
};

// Get sales by car ID
export const getSalesByCarId = async (req, res) => {
    try {
        const db = getDB();
        const { carId } = req.params;
        
        const sales = await db.collection("sales").find({ 
            car_id: Number(carId) 
        }).toArray();
        
        res.json(sales);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error fetching sales", error: err });
    }
};

// Create a new sale
export const createSale = async (req, res) => {
    try {
        const db = getDB();
        const { car_id, customer_name, sale_price, salesperson, sale_date } = req.body;
        
        // Validate required fields
        if (!car_id || !customer_name || !sale_price || !salesperson || !sale_date) {
            return res.status(400).json({ 
                message: "Missing required fields: car_id, customer_name, sale_price, salesperson, sale_date" 
            });
        }
        
        const newSale = {
            car_id: Number(car_id),
            customer_name,
            sale_price: Number(sale_price),
            salesperson,
            sale_date,
            createdAt: new Date()
        };
        
        const result = await db.collection("sales").insertOne(newSale);
        
        res.status(201).json({ 
            message: "Sale created successfully",
            saleId: result.insertedId 
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error creating sale", error: err });
    }
};

// Update a sale
export const updateSale = async (req, res) => {
    try {
        const db = getDB();
        const { id } = req.params;
        const updateData = req.body;
        
        // Convert numeric fields if provided
        if (updateData.car_id) updateData.car_id = Number(updateData.car_id);
        if (updateData.sale_price) updateData.sale_price = Number(updateData.sale_price);
        
        let filter;
        try {
            filter = { _id: new ObjectId(id) };
        } catch (e) {
            filter = { _id: id };
        }
        
        const result = await db.collection("sales").updateOne(
            filter,
            { $set: updateData }
        );
        
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "Sale not found" });
        }
        
        res.json({ 
            message: "Sale updated successfully",
            modifiedCount: result.modifiedCount 
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error updating sale", error: err });
    }
};

// Delete a sale
export const deleteSale = async (req, res) => {
    try {
        const db = getDB();
        const { id } = req.params;
        
        let filter;
        try {
            filter = { _id: new ObjectId(id) };
        } catch (e) {
            filter = { _id: id };
        }
        
        const result = await db.collection("sales").deleteOne(filter);
        
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Sale not found" });
        }
        
        res.json({ 
            message: "Sale deleted successfully",
            deletedCount: result.deletedCount 
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error deleting sale", error: err });
    }
};
