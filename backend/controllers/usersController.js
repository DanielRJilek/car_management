import { getDB } from "../db/dbConn.js";
import bcrypt from "bcrypt";

export const getUsers = async(req, res) => {
    try {
        let db = getDB();
        const users = await db.collection("users").toArray();     
        res.json(users);
    } catch (err) {
        console.log(err);
    }
}

export const getUserById = async (req, res) => {
    try {
        let db = getDB();
        const { userID } = req.params;
        const user = await db.collection("users").findOne({ userID: Number(userID) });
        res.json(user);
    } catch (err) {
        console.log(err);
    }
}

export const getMyData = async (req, res) => {
    try {
        // Check if user is authenticated
        if (!req.user) {
            // Return empty response for unauthenticated users
            return res.json({ _id: null, username: null });
        }
        
        let db = getDB();
        const user = await db.collection("users").findOne({ _id: req.user._id });
        if (!user) {
            return res.status(400).json({message: "No user found"});
        }
        res.json({ _id: user._id, username: user.username });
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Error fetching user data", error: err});
    }
};

export const createUser = async (req, res) => {
    try {
        let db = getDB();
        const { username, password1, password2 } = req.body;
        
        // Validate required fields
        if (!username || !password1 || !password2) {
            return res.status(400).json({ message: "Missing required fields: username, password1, password2" });
        }
        
        // Validate passwords match
        if (password1 !== password2) {
            return res.status(400).json({ message: "Passwords do not match" });
        }
        
        // Check if user already exists
        const existingUser = await db.collection("users").findOne({ username });
        if (existingUser) {
            return res.status(409).json({ message: "Username already exists" });
        }
        
        // Hash the password
        const hashedPassword = await bcrypt.hash(password1, 10);
        
        // Store only the hashed password, not password1 and password2
        const newUser = { 
            username, 
            password: hashedPassword 
        };
        const result = await db.collection("users").insertOne(newUser);
        
        res.status(201).json({ 
            message: "User created successfully",
            userId: result.insertedId 
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error creating user", error: err.message });
    }   
}