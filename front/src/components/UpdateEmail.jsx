/** @format */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "./AxiosInstance";

function EmailUpdateForm() {
  const [newEmail, setNewEmail] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.put("/profile/update-email", {
        newEmail,
      });
      console.log(response);
      setSuccess(response.data.message);
      navigate("/profile/update-email/verify-new-email");
    } catch (error) {
      setError(error.response.data.errors || error.response.data);
    }
  };

  return (
    <div className="form-container">
      <h1 className="form-title">Update Email</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="confirm-password">your new email</label>
          <input
            type="email"
            id="confirm-password"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit">Update</button>
      </form>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
    </div>
  );
}

export default EmailUpdateForm;
