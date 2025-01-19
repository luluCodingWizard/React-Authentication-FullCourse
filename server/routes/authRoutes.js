import express from "express";
import passport from "passport";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { validateLogin } from "../middlewares/validateLogin.js";
import {
  registerUser,
  loginUser,
  logoutUser,
  verifyController,
  forgotPassword,
  refreshToken,
  generateTokens,
} from "../controllers/authController.js";

const router = express.Router();

// POST route for user registration
router.post("/register", registerUser);
router.post("/refresh-token", refreshToken);
router.get("/verify-email/:token", verifyController);
router.post("/login", validateLogin, loginUser);
router.post("/logout", logoutUser);
router.post("/forgot-password", forgotPassword);

// Google OAuth Routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  async (req, res) => {
    const user = req.user;

    // Check if the user already exists in the database
    let existingUser = await User.findOne({ email: user.email });

    if (!existingUser) {
      // Create a new user if the user doesn't exist
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("222", salt);

      const newUser = new User({
        name: user.name, // From Google OAuth profile
        email: user.email, // From Google OAuth profile
        password: hashedPassword, // Handle the password case (set a default, or ask user to set later)
        isVerified: true,
      });

      // Save the new user to the database
      try {
        await newUser.save();
      } catch (error) {
        console.error("Error saving user to database:", error);
        return res
          .status(500)
          .json({ message: "Error saving user to database." });
      }
    }

    // Generate JWT for access and refresh

    const { accessToken, refreshToken } = await generateTokens(user);
    // Set tokens as cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true, // Secure from XSS
      secure: process.env.NODE_ENV === "production", // Send only over HTTPS in production
      sameSite: "strict", // Prevent CSRF
      maxAge: 15 * 60 * 1000, // Expires in 15 minutes
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // Expires in 7 days
    });
    res.redirect(`http://localhost:5173/dashboard`); // Or wherever you want the user to go
  }
);

export default router;
