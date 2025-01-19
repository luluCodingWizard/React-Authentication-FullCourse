import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const OAuthCallback = () => {
  const { setToken } = useContext(AuthContext);

  const navigate = useNavigate();

  // This function will handle the redirect from Google
  const handleGoogleCallback = async () => {
    const urlParams = new URLSearchParams(window.location.search); // Get query parameters
    const code = urlParams.get("code"); // Extract the 'code' parameter

    if (code) {
      try {
        // Call your backend to exchange the authorization code for the JWT token
        const response = await fetch(
          `http://localhost:5000/api/auth/google/callback?code=${code}`
        );
        const data = await response.json();

        if (response.ok) {
          setToken(data.token, data.refreshToken);
          // Redirect to the dashboard or homepage after successful login
          //   navigate("/dashboard");
        } else {
          console.error("Token is missing from the callback URL");
          alert("Authentication failed. Please try again.");
          navigate("/login");
        }
      } catch (error) {
        console.error("Token is missing from the callback URL");
        alert("Authentication failed. Please try again.");
        navigate("/login");
      }
    }
  };
  useEffect(() => {
    // Call the handleGoogleCallback function when the component mounts
    handleGoogleCallback();
  }, [setToken, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-xl font-semibold">Logging you in...</h1>
    </div>
  );
};

export default OAuthCallback;
