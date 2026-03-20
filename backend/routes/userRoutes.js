import express from "express";
import { ObjectId } from "mongodb";
import * as controller from '../controllers/usersController.js'
import passport from '../config/passport.js'


export default function userRoutes(db) {
  const router = express.Router();

  router.route('/')
    .get(passport.authenticate("jwt", { session: false }), controller.getMyData)
    .post(controller.createUser)

  return router;
}
