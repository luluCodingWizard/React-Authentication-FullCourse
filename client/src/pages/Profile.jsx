import React, { useState, useEffect } from "react";
import { fetchWithAuth } from "../utils/fetchWithAuth";
const ProfilePage = ({ onLogoutWarning }) => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    info: {
      bio: "",
      favoriteColor: "",
    },
  });

  const [updatedUser, setUpdatedUser] = useState({ ...user });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetchWithAuth(
          "http://localhost:5000/api/user/me",
          {
            method: "GET",
          },
          OnLogoutWarning
        );

        // Check if the response is successful
        if (!response.ok) {
          throw new Error("Invalid call");
        }

        // Parse the JSON response
        const data = await response.json();

        setUser(data);
        setUpdatedUser(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
    fetchUserDetails();
  }, [OnLogoutWarning]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in user.info) {
      setUpdatedUser((prev) => ({
        ...prev,
        info: { ...prev.info, [name]: value },
      }));
    } else {
      setUpdatedUser((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/user/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedUser),
      });
      // if all good
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setUser(data);
      setMessage("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating user details:", error);
      setMessage("Failed to update profile.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded">
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={updatedUser.name}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={updatedUser.email}
            disabled
            className="border border-gray-300 p-2 rounded w-full bg-gray-100 cursor-not-allowed"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Bio</label>
          <textarea
            name="bio"
            value={updatedUser.info.bio}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Favorite Color
          </label>
          <input
            type="text"
            name="favoriteColor"
            value={updatedUser.info.favoriteColor}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded w-full"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Save Changes
        </button>
      </form>
      {message && <p className="mt-4 text-green-500">{message}</p>}
    </div>
  );
};

export default ProfilePage;
