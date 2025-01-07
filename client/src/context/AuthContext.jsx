// context/AuthContext.js
import React, { createContext } from "react";
import { useToken } from "../hooks/useToken.js";
import { useAuth } from "../hooks/useAuth.js";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { token, setToken } = useToken();
  const { logout: authLogout, user } = useAuth();

  const logout = () => {
    console.log("logout");
    authLogout();
  };

  return (
    <AuthContext.Provider value={{ token, user, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
