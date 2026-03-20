import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import bcrypt from "bcrypt";
import { getDB } from "../db/dbConn.js";

// Local Strategy for Login
const localStrategy = new LocalStrategy(
    {
        usernameField: "username",
        passwordField: "password",
    },
    async (username, password, done) => {
        try {
            const db = getDB();
            const user = await db.collection("users").findOne({ name: username });

            if (!user) {
                return done(null, false, { message: "User not found" });
            }

            // Compare password with hashed password
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                return done(null, false, { message: "Invalid password" });
            }

            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }
);

// JWT Strategy for Protected Routes
const jwtStrategy = new JWTStrategy(
    {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET || "your_jwt_secret_key_here",
    },
    async (jwtPayload, done) => {
        try {
            const db = getDB();
            const user = await db.collection("users").findOne({ _id: jwtPayload.userId });

            if (!user) {
                return done(null, false);
            }

            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }
);

// Serialize user (store user id in session/token)
passport.serializeUser((user, done) => {
    done(null, user._id);
});

// Deserialize user (retrieve user from id)
passport.deserializeUser(async (id, done) => {
    try {
        const db = getDB();
        const user = await db.collection("users").findOne({ _id: id });
        done(null, user);
    } catch (err) {
        done(err);
    }
});

passport.use("local", localStrategy);
passport.use("jwt", jwtStrategy);

export default passport;