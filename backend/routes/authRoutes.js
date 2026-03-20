import express from "express";
import { login, logout, refresh, signup } from "../controllers/authController.js";
import passport from "../config/passport.js";

export default function authRoutes(db) {
    const router = express.Router();

    // Signup route
    router.post("/signup", signup);

    // Login route
    router.post("/login", login);

    // Logout route (requires authentication)
    router.post("/logout", passport.authenticate("jwt", { session: false }), logout);

    // Refresh token route
    router.post("/refresh", refresh);

    return router;
}