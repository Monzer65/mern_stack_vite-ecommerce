/** @format */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../hooks/UseAxiosPrivate";

function PhoneUpdateForm() {
  const [newPhone, setNewPhone] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const axiosPrivate = useAxiosPrivate();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosPrivate.put("/profile/update-phone", {
        newPhone,
      });
      console.log(response);
      setSuccess(response.data.message);
      navigate("/profile/update-phone/verify-new-phone");
    } catch (error) {
      setError(error.response.data.errors || error.response.data);
    }
  };

  return (
    <div className="form-container">
      <h1 className="form-title">Update Phone</h1>
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="update-phone">your new phone</label>
          <input
            type="text"
            id="update-phone"
            value={newPhone}
            onChange={(e) => setNewPhone(e.target.value)}
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

export default PhoneUpdateForm;
