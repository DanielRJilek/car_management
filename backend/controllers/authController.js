import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { getDB } from "../db/dbConn.js";
import passport from "../../config/passport.js";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key_here";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "your_refresh_token_secret_key_here";

// Generate JWT Token
const generateToken = (userId) => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1h" });
};

// Generate Refresh Token
const generateRefreshToken = (userId) => {
    return jwt.sign({ userId }, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

// Login Controller
export const login = (req, res, next) => {
    passport.authenticate("local", async (err, user, info) => {
        if (err) {
            return res.status(500).json({ message: "Internal server error", error: err });
        }

        if (!user) {
            return res.status(401).json({ message: info?.message || "Authentication failed" });
        }

        try {
            const accessToken = generateToken(user._id);
            const refreshToken = generateRefreshToken(user._id);

            // Store refresh token in database (optional but recommended)
            const db = getDB();
            await db.collection("users").updateOne(
                { _id: user._id },
                { $set: { refreshToken } }
            );

            res.json({
                message: "Login successful",
                accessToken,
                refreshToken,
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                },
            });
        } catch (error) {
            res.status(500).json({ message: "Error generating tokens", error });
        }
    })(req, res, next);
};

// Logout Controller
export const logout = async (req, res) => {
    try {
        const userId = req.user?._id;

        if (!userId) {
            return res.status(400).json({ message: "User not authenticated" });
        }

        const db = getDB();
        // Clear refresh token from database
        await db.collection("users").updateOne(
            { _id: userId },
            { $unset: { refreshToken: "" } }
        );

        res.json({ message: "Logout successful" });
    } catch (error) {
        res.status(500).json({ message: "Error during logout", error });
    }
};

// Refresh Token Controller
export const refresh = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(401).json({ message: "Refresh token required" });
        }

        // Verify refresh token
        jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: "Invalid or expired refresh token" });
            }

            try {
                const db = getDB();
                const user = await db.collection("users").findOne({ _id: decoded.userId });

                if (!user || user.refreshToken !== refreshToken) {
                    return res.status(401).json({ message: "Refresh token mismatch or user not found" });
                }

                // Generate new access token
                const newAccessToken = generateToken(user._id);

                res.json({
                    message: "Token refreshed successfully",
                    accessToken: newAccessToken,
                });
            } catch (error) {
                res.status(500).json({ message: "Error refreshing token", error });
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Error during token refresh", error });
    }
};

// Signup Controller
export const signup = async (req, res) => {
    try {
        const { email, password, name } = req.body;

        // Validate input
        if (!email || !password || !name) {
            return res.status(400).json({ message: "Email, password, and name are required" });
        }

        const db = getDB();

        // Check if user already exists
        const existingUser = await db.collection("users").findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = {
            email,
            password: hashedPassword,
            name,
            createdAt: new Date(),
        };

        const result = await db.collection("users").insertOne(newUser);

        res.status(201).json({
            message: "User created successfully",
            userId: result.insertedId,
        });
    } catch (error) {
        res.status(500).json({ message: "Error creating user", error });
    }
};
