import express from "express";
import { ObjectId } from "mongodb";
import * as controller from '../controllers/usersController.js'


export default function userRoutes(db) {
  const router = express.Router();

  router.route('/')
    .get(controller.getMyData)
    .post(controller.createUser)

  return router;
}
