import { useContext } from "react";

import { AuthContext } from "../context/AuthContext.jsx";

const LogoutWarning = ({ onLogout }) => {
  const { logout } = useContext(AuthContext);
  const handleLogout = () => {
    onLogout();
    logout();
  };
  return (
    <div className="p-4 bg-red-100 text-red-800 rounded">
      <p>Your session has expired. Please log in again.</p>
      <button
        className="mt-2 px-4 py-2 bg-red-500 text-white rounded"
        onClick={handleLogout}
      >
        Log In Again
      </button>
    </div>
  );
};

export default LogoutWarning;
