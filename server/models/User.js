import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    required: true,
    default: false,
  },

  role: {
    type: String,
    enum: ["user", "admin", "moderator"],
    default: "user", // Default to a regular user
  },
  info: {
    bio: {
      type: String,
      default: "", // Empty by default
    },
    favoriteColor: {
      type: String,
      default: "", // Empty by default
    },
  },
});

const User = mongoose.model("User", userSchema);
export default User;
