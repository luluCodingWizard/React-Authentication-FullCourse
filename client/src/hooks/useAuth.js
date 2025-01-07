// hooks/useAuth.js
import { useToken } from "./useToken.js";
import { useUser } from "./useUser.js";

export const useAuth = () => {
  const { clearToken } = useToken();
  const { user } = useUser();

  const logout = async () => {
    try {
      // Make a request to the backend to invalidate the token
      const response = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        clearToken(); // Clear the token on the frontend
        alert("Logged out successfully!");
        window.location.href = "/login"; // Redirect to login page
      } else {
        const { message } = await response.json();
        alert(`Logout failed: ${message}`);
      }
    } catch (error) {
      console.error("Error logging out:", error);
      alert("An error occurred while logging out!");
    }
  };

  return { user, logout };
};
