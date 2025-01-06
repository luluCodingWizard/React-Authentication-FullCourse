import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

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

    await newUser.save();
    // generate the JWT
    const token = jwt.sign(
      {
        id: newUser._id,
        name: newUser.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(201).json({ message: "User created!", token });
  } catch (error) {
    console.error("Error registration:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export { registerUser };
