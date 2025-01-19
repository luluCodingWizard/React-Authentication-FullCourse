import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
const Dashboard = () => {
  const { setToken } = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    // Parse the URL parameters
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const refreshToken = params.get("refreshToken");

    if (token && refreshToken) {
      // Save tokens to localStorage or cookies
      setToken(token, refreshToken);

      // Auto-login logic here
      console.log("Tokens saved, user is logged in!");

      // Optionally, clear query params from the URL
      navigate("/dashboard", { replace: true });
    } else {
      console.error("Missing tokens in the URL");
    }
  }, [navigate]);
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
      </div>
    </div>
  );
};

export default Dashboard;
