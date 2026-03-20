import { getDB } from "../db/dbConn.js";

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

export const getMyData = (async (req,res) => {
    try {
        let db = getDB();
        const {id} = req.user;
        const user = await db.collection("users").findOne({ userID: Number(id) });
        if (!user) {
            return res.status(400).json({message: "No user found"});
        }
    } catch (err) {
        console.log(err);
    }

    res.json(user);
});

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
        
        const newUser = { username, password1, password2, createdAt: new Date() };
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