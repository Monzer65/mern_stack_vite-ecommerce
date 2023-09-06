/** @format */

import { useEffect, useState } from "react";
import axiosInstance from "./AxiosInstance";

const Logout = () => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Create a function to handle the logout process
    const handleLogout = async () => {
      try {
        // Send a logout request to your server
        const response = await axiosInstance.post("/auth/logout");

        if (response.status === 200) {
          // Clear the local storage or cookies as needed
          localStorage.removeItem("accessToken");
          // Redirect or display a message
          setMessage(response.data.message);
          window.location.href = `/`;
        } else {
          setError("Logout failed");
        }
      } catch (err) {
        console.error("Error during logout:", err);
        setError("Server error");
      }
    };

    // Call the handleLogout function
    handleLogout();
  }, []);

  return (
    <div>
      {message && <p>{message}</p>}
      {error && <p>{error}</p>}
    </div>
  );
};

export default Logout;
