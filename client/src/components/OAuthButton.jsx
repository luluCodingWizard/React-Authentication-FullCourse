import React from "react";

const OAuthButton = ({ provider }) => {
  const handleLogin = () => {
    window.location.href = `http://localhost:5000/api/auth/${provider}`;
  };

  const providerNames = {
    google: "Google",
    github: "GitHub",
  };
  return (
    <button
      onClick={handleLogin}
      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full flex items-center justify-center"
    >
      {provider === "google" && (
        <img src="/google-icon.svg" alt="Google" className="w-5 h-5 mr-2" />
      )}
      {provider === "github" && (
        <img src="/github-icon.svg" alt="GitHub" className="w-5 h-5 mr-2" />
      )}
      Login with {providerNames[provider]}
    </button>
  );
};

export default OAuthButton;
