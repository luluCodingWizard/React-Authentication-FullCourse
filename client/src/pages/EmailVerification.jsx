import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
const EmailVerification = () => {
  const { token } = useParams(); // extract the token from the url
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/auth/verify-email/${token}`,
          {
            method: "GET",
          }
        );
        if (response.ok) {
          setMessage("Your email has been successfully verified!");
        } else {
          const errorData = await response.json();
          setMessage(errorData.message || "Email verification failed.");
        }
      } catch (error) {
        setMessage(
          "An error occurred while verifying your email. please try again"
        );
      }
    };
    verifyEmail();
  }, []);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold">{message}</h1>
    </div>
  );
};

export default EmailVerification;
