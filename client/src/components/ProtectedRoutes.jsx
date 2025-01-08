import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
const ProtectedRoute = ({ children, requiredRoles }) => {
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("token"); // Check if a token exists

  if (!token) {
    return <Navigate to="/login" />;
  }
  // Redirect to unauthorized if user role is not allowed
  if (requiredRoles && (!user || !requiredRoles.includes(user.role))) {
    return <Navigate to="/unauthorized" />;
  }
  return children;
};

export default ProtectedRoute;
