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
        const newUser = req.body;
        await db.collection("users").insertOne(newUser);        
        res.json({ message: "User created successfully" });
    } catch (err) {
        console.log(err);
    }   
}