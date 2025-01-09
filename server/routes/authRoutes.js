import express from "express";
import { validateLogin } from "../middlewares/validateLogin.js";
import {
  registerUser,
  loginUser,
  logoutUser,
  verifyController,
} from "../controllers/authController.js";

const router = express.Router();

// POST route for user registration
router.post("/register", registerUser);
router.get("/verify-email/:token", verifyController);
router.post("/login", validateLogin, loginUser);
router.post("/logout", logoutUser);

export default router;
