// hooks/useUser.js
import { useState, useEffect } from "react";
import { useToken } from "./useToken.js";

export const useUser = () => {
  const { token } = useToken();
  const [user, setUser] = useState(null);

  // Decode the JWT payload
  const getPayloadFromToken = (token) => {
    if (!token) return null; // Handle null token
    try {
      const encodedPayload = token.split(".")[1]; // Middle part of the JWT
      return JSON.parse(atob(encodedPayload));
    } catch (error) {
      console.error("Invalid token:", error);
      return null; // Handle invalid token
    }
  };

  // Update the user whenever the token changes
  useEffect(() => {
    console.log("useEffect.....");
    console.log(token);
    if (!token) {
      setUser(null); // No token, clear user
    } else {
      setUser(getPayloadFromToken(token)); // Decode and set user
    }
  }, [token]); // Triggered when `token` changes

  return { user };
};
