import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import {
  getUserDetails,
  updateUserDetails,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/me", verifyToken, getUserDetails);
router.put("/me", verifyToken, updateUserDetails);
