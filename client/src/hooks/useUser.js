import { useState, useEffect } from "react";
import { useToken } from "./useToken.js";

export const useUser = () => {
  const { token } = useToken();
  const [user, setUser] = useState(null);

  // Function to decode the JWT
  const getPayloadFromToken = (token) => {
    const encodedPayload = token.split(".")[1]; // Get the middle part
    return JSON.parse(atob(encodedPayload)); // Decode and parse JSON
  };

  // Update user whenever the token changes
  useEffect(() => {
    if (!token) {
      setUser(null); // No token, no user
    } else {
      setUser(getPayloadFromToken(token)); // Decode token to user
    }
  }, [token]); // Runs whenever token changes

  return { user };
};
