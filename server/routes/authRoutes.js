import express from "express";
import { validateLogin } from "../middlewares/validateLogin.js";
import {
  registerUser,
  loginUser,
  logoutUser,
  verifyController,
  forgotPassword,
  refreshToken,
} from "../controllers/authController.js";

const router = express.Router();

// POST route for user registration
router.post("/register", registerUser);
router.post("/refresh-token", refreshToken);
router.get("/verify-email/:token", verifyController);
router.post("/login", validateLogin, loginUser);
router.post("/logout", logoutUser);
router.post("/forgot-password", forgotPassword);

export default router;
