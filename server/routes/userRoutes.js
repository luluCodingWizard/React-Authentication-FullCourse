import express from "express";
import verifyToken from "../middlewares/authMiddleware.js";
import { checkRole } from "../middlewares/checkRole.js";
import {
  getUserDetails,
  updateUserDetails,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/me", verifyToken, checkRole(["user", "admin"]), getUserDetails);
router.put("/me", verifyToken, checkRole(["user", "admin"]), updateUserDetails);
router.post("/updaterole", verifyToken, updateUserDetails);

export default router;
