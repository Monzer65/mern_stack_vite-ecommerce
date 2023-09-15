/** @format */

import { useState } from "react";
import axiosInstance from "../../utiles/AxiosInstance";
import { useNavigate } from "react-router-dom";

function AddressUpdateForm() {
  const [formData, setFormData] = useState({
    postalCode: "",
    postalPhone: "",
    apartment: "",
    street: "",
    city: "",
    province: "",
  });

  const [errors, setErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.put(
        "/profile/update-address",
        formData
      );
      setSuccessMessage(response.data.message);
      setErrors([]);
      navigate("/profile");
    } catch (error) {
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        console.error("Error during updating address:", error);
        setErrors(["Server error"]);
      }
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Update Address</h2>
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="postal-code">postal code</label>
          <input
            type="text"
            name="postal-code"
            placeholder="Postal Code"
            value={formData.postalCode}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="postal-Phone">postal phone</label>
          <input
            type="text"
            name="postal-phone"
            placeholder="Postal phone"
            value={formData.postalCode}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="apartment">apartment</label>
          <input
            type="text"
            name="apartment"
            placeholder="apartment"
            value={formData.apartment}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="street">street</label>
          <input
            type="text"
            name="street"
            placeholder="street"
            value={formData.street}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="city">city</label>
          <input
            type="text"
            name="city"
            placeholder="city"
            value={formData.city}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="province">province</label>
          <input
            type="text"
            name="province"
            placeholder="province"
            value={formData.province}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Update Address</button>
      </form>
      {errors.length > 0 && (
        <div className="error-messages">
          {errors.map((error, index) => (
            <div key={index} className="error-message">
              {error}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AddressUpdateForm;
