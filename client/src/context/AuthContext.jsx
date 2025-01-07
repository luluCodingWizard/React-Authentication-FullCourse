// context/AuthContext.js
import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // step 1: create token state to linked to localstorage
  const [token, setTokenInternal] = useState(() => {
    return localStorage.getItem("token");
  });
  const [user, setUser] = useState(null);
  // step 2:  function that updates the token in my state and local storage
  const setToken = (newToken) => {
    localStorage.setItem("token", newToken);
    setTokenInternal(newToken);
  };

  // step 3: function to clear my token
  const clearToken = () => {
    localStorage.removeItem("token");
    setTokenInternal(null);
  };

  // Decode the JWT payload
  const getPayloadFromToken = (token) => {
    if (!token) return null;
    try {
      const encodedPayload = token.split(".")[1];
      return JSON.parse(atob(encodedPayload));
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  // Update the user whenever the token changes
  useEffect(() => {
    if (!token) {
      setUser(null); // Clear user if token is null
    } else {
      setUser(getPayloadFromToken(token)); // Decode user from token
    }
  }, [token]);

  // Handle logout
  const logout = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        clearToken(); // Clear token and user on logout
        alert("Logged out successfully!");
        window.location.href = "/login";
      } else {
        const { message } = await response.json();
        alert(`Logout failed: ${message}`);
      }
    } catch (error) {
      console.error("Error logging out:", error);
      alert("An error occurred while logging out!");
    }
  };

  return (
    <AuthContext.Provider value={{ token, user, setToken, logout, clearToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
