/** @format */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "./AxiosInstance";

function PasswordUpdateForm() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match");
      return;
    }
    try {
      const response = await axiosInstance.put("/profile/update-password", {
        oldPassword,
        newPassword,
      });
      console.log(response);
      setSuccess(response.data.message);
      setTimeout(() => {
        navigate("/profile");
      }, 2000);
    } catch (error) {
      setError(error.response.data.errors || error.response.data);
    }
  };

  return (
    <div className="form-container">
      <h1 className="form-title">Update Password</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="old-password">Old Password</label>
          <input
            type="password"
            id="old-password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="new-password">New Password</label>
          <input
            type="password"
            id="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirm-password">Confirm Password</label>
          <input
            type="password"
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Update Password</button>
      </form>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
    </div>
  );
}

export default PasswordUpdateForm;
