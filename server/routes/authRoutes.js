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

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Google login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
    res.redirect("/dashboard"); // Or wherever you want the user to go
  }
);

export default router;
