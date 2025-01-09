import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendVerificationEmail } from "../utils/email.js";
import User from "../models/User.js";
import { blacklistToken } from "../config/redisClient.js";

const registerUser = async (req, res) => {
  const { name, email, password, info, isVerified } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "please fill in all fields" });
  }
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      info,
      isVerified,
    });

    // generate the JWT
    const token = jwt.sign(
      {
        id: newUser._id,
        name: newUser.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    newUser.verificationToken = token;
    newUser.verificationTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    await newUser.save();
    // Send verification email
    await sendVerificationEmail(newUser.email, token);

    res.status(201).json({
      message: "User created check your Email for the verification!",
      token,
    });
  } catch (error) {
    console.error("Error registration:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // find a user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // verify the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password!" });
    }

    // generate JWT

    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // send success response with token

    res.status(200).json({
      message: "login success!",
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role || "user",
      },
    });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
};

const logoutUser = (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract JWT from Authorization header
  if (!token) {
    return res.status(400).json({ message: "No token provided!" });
  }

  // Decode the token to get its expiration time
  const { exp } = jwt.decode(token);
  const expiresIn = exp - Math.floor(Date.now() / 1000);

  // blacklist teh token
  blacklistToken(token, expiresIn);
  res.status(200).json({ message: "Successfully logged out!" });
};

const verifyController = async (req, res) => {
  const { token } = req.query;
  try {
    // Decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Find user by ID and ensure token matches
    const user = await User.findById(decoded.userId);
    if (!user || user.verificationToken !== token) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    // Verify the user
    user.isVerified = true;
    user.verificationToken = undefined; // Clear the token
    user.verificationTokenExpiry = undefined; // Clear expiry
    await user.save();
    res.status(200).json({ message: "Email verified successfully!" });
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(400).json({ message: "Verification failed." });
  }
};

export { registerUser, loginUser, logoutUser, verifyController };
