export const checkRole = (requiredRoles) => {
  return (req, res, next) => {
    const userRole = req.user.role; // req.user is set by the authentication middleware

    if (!requiredRoles.includes(userRole)) {
      return res
        .status(403)
        .json({ message: "Access denied. Insufficient permissions." });
    }

    next(); // If the user has the required role, proceed to the next middleware or route handler
  };
};
