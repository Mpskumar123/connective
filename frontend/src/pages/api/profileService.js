// src/api/profileService.js

import axios from "axios";

// Function to fetch profile data with cache-busting
export const getProfile = async (token) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/users/profile?${new Date().getTime()}`, // Adding timestamp for cache-busting
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};

// Function to update profile data
export const updateProfile = async (token, profileData) => {
  try {
    const response = await axios.put(
      "http://localhost:5000/api/users/profile",
      profileData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};
