/** @format */

import { useEffect, useState } from "react";
import useAxiosPrivate from "../../hooks/UseAxiosPrivate";

const Logout = () => {
  const axiosPrivate = useAxiosPrivate();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const handleLogout = async () => {
      try {
        const response = await axiosPrivate.post("/auth/logout");
        if (response.status === 200) {
          setMessage(response.data.message);
        } else {
          setError("Logout failed");
        }
      } catch (err) {
        console.error("Error during logout:", err);
        setError("Server error");
      }
    };

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
