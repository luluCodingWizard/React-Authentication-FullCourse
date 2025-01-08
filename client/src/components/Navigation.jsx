import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
const Navigation = () => {
  const { user, logout } = useContext(AuthContext);
  return (
    <nav className="flex items-center justify-between p-4 bg-gray-800 text-white">
      <div className="text-lg font-bold">
        <a href="/" className="hover:underline">
          My App
        </a>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span>Welcome, {user.name || "User"}!</span>
            <Link
              to="/profile"
              className="px-4 py-2 bg-green-500 rounded hover:bg-green-600"
            >
              Profile
            </Link>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <a
            href="/login"
            className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600"
          >
            Login
          </a>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
