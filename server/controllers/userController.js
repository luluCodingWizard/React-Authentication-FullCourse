import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const getUserDetails = async (req, res) => {
  try {
    // find the user by ID
    // Exclude the password field
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json(user); // Return the user details
  } catch (error) {
    console.error("Error getting user details:", error);
    res.status(500).json({ message: "Error fetching user details." });
  }
};

export const updateUserDetails = async (req, res) => {
  try {
    // Extract the details we want to update from the request body
    const { name, email, bio, favoriteColor } = req.body;
    // Find the user based on the user ID from the token
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Update the user's details
    user.name = name || user.name; // If name is provided, use it; otherwise, keep the existing name
    user.email = email || user.email;
    user.info.bio = bio || user.info.bio;
    user.info.favoriteColor = favoriteColor || user.info.favoriteColor;
    // Save the updated user to the database
    await user.save();
    res.status(200).json({ message: "User details updated successfully." });
  } catch (error) {
    console.error("Error updating user details:", error);
    res.status(500).json({ message: "Error updating user details." });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { userId, role } = req.body;

    if (!["user", "admin", "moderator"].includes(role)) {
      return res.status(400).json({ message: "Invalid role specified" });
    }

    const user = await User.findByIdAndUpdate(userId, { role }, { new: true });
    res.status(200).json({ message: "User role updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Failed to update user role", error });
  }
};
