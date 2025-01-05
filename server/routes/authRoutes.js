import express from "express";
import { registerUser } from "../controllers/authController.js";

const router = express.Router();

// POST route for user registration
router.post("/register", registerUser);

export default router;
