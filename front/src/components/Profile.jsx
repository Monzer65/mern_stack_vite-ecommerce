/** @format */

import axiosInstance from "./AxiosInstance";
import { useState, useEffect } from "react";

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Define a function to fetch the user profile
    const fetchUserProfile = async () => {
      try {
        // Make an authorized GET request to the user profile endpoint
        const response = await axiosInstance.get("/profile");
        // Set the profile state with the response data
        setProfile(response.data.profile);
        setLoading(false);
      } catch (error) {
        // Handle any errors
        setError(error.response.data);
        setLoading(false);
      }
    };

    // Call the fetchUserProfile function
    fetchUserProfile();
  }, []);

  return (
    <div>
      <h1>User Profile</h1>
      {loading && <p>Loading...</p>}
      {error && <p> {error}</p>}
      {profile && (
        <div>
          <p>Name: {profile.name}</p>
          <p>Email: {profile.email}</p>
          <p>phone: {profile.phone}</p>
          <p>postalCode: {profile.postalCode}</p>
          <p>apartment: {profile.apartment}</p>
          <p>street: {profile.street}</p>
          <p>city: {profile.city}</p>
          <p>province: {profile.province}</p>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
