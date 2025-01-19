import jwt from "jsonwebtoken";

const verifyToken = async (req, res, next) => {
  const token = req.cookies.accessToken; // Extract token from cookies
  if (!token) {
    return res
      .status(403)
      .json({ message: "Access denied, no token provided." });
  }

  try {
    // Decode the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Secret key to verify the token
    req.user = decoded; // Attach the decoded data (user ID) to the request object
    next();
  } catch (error) {
    // If there's an error, like an invalid or expired token
    console.error("Token verification failed:", error);
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

export default verifyToken;
