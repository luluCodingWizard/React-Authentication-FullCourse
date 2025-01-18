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

    // Generate tokens
    const { accessToken, refreshToken } = await generateTokens(user);

    // send success response with token

    res.status(200).json({
      message: "login success!",
      token: accessToken,
      refreshToken,
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
// to generate tokens
const generateTokens = async (user) => {
  const accessToken = jwt.sign(
    { id: user._id, name: user.name, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "10s" } // Access token expires in 15 minutes
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" } // Refresh token expires in 7 days
  );
  // Store the refresh token in the database
  user.refreshToken = refreshToken;
  await user.save();
  return { accessToken, refreshToken };
};
// Refresh Token Endpoint
export const refreshToken = async (req, res) => {
  const { token } = req.body;

  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const existingUser = await User.findOne({ refreshToken: token });
    if (!existingUser)
      return res.status(403).json({ message: "Invalid token" });

    // Verify the refresh token
    jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err)
          return res.status(403).json({ message: "Token expired or invalid" });

        // Generate new access token
        const { accessToken } = await generateTokens(existingUser);

        res.status(200).json({ token: accessToken });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const logoutUser = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract JWT from Authorization header
  if (!token) {
    return res.status(400).json({ message: "No token provided!" });
  }

  try {
    // Decode the token to get userId (JWT contains userId)
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace with your actual secret key

    const userId = decoded.id; // Assuming 'id' is in the token payload
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.refreshToken = null; // Clear the refresh token
    await user.save();

    // Decode the token to get its expiration time
    const { exp } = jwt.decode(token);
    const expiresIn = exp - Math.floor(Date.now() / 1000);

    // blacklist teh token
    blacklistToken(token, expiresIn);

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      // If the token has expired, handle it here
      console.error("Token has expired:", error.message);
      return res
        .status(401)
        .json({ message: "Token has expired. Please log in again." });
    }
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const verifyController = async (req, res) => {
  const { token } = req.params;

  try {
    // Decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Find user by ID and ensure token matches
    const user = await User.findById(decoded.id).select(
      "+verificationToken +verificationTokenExpiry"
    );
    if (user.isVerified) {
      res.status(200).json({ message: "Email already verified successfully!" });
    } else {
      if (!user || user.verificationToken !== token) {
        return res.status(400).json({ message: "Invalid or expired token." });
      }

      // Verify the user
      user.isVerified = true;
      user.verificationToken = undefined; // Clear the token
      user.verificationTokenExpiry = undefined; // Clear expiry
      await user.save();
      res.status(200).json({ message: "Email verified successfully!" });
    }
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(400).json({ message: "Verification failed." });
  }
};

// Forgot Password Controller
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // 1. Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({
        message: "If your email exists, you will receive a reset link shortly.",
      });
    }

    // 2. Generate a secure token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 3600000; // Token expires in 1 hour

    // 3. Save the token and expiry to the user record
    user.passwordResetToken = resetToken;
    user.passwordResetTokenExpiry = resetTokenExpiry;
    await user.save();

    // 4. Send the reset email
    await sendResetPasswordEmail(user.email, resetToken);

    return res.status(200).json({
      message: "Reset link sent to your email address.",
    });
  } catch (error) {
    console.error("Error in forgotPassword controller:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export { registerUser, loginUser, logoutUser, verifyController };
