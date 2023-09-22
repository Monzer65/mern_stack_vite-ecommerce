/** @format */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../hooks/UseAxiosPrivate";

function NameUpdateForm() {
  const axiosPrivate = useAxiosPrivate();
  const [newName, setNewName] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosPrivate.put("/profile/update-name", {
        name: newName,
      });
      setSuccess(response.data.message);
      localStorage.setItem("userName", newName);
      navigate("/profile");
    } catch (error) {
      setError(error.response.data.errors || error.response.data);
    }
  };

  return (
    <div className="form-container">
      <h1 className="form-title">Update Name</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">your new name</label>
          <input
            type="text"
            id="name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
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

export default NameUpdateForm;
