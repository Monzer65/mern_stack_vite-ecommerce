/** @format */

import { useState } from "react";
import useAxios from "./UseAxios";
const Login = () => {
  const {
    response: data,
    error,
    loading,
  } = useAxios({
    url: "http://localhost:3000/api/auth/login",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const [formData, setFormData] = useState({
    contact: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic and API call here
  };

  return (
    <div className="login-container">
      <h2 className="login-title">login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="login-form-group">
          <label className="login-label" htmlFor="contact">
            Email or Phone
          </label>
          <input
            className="login-input"
            id="contact"
            type="text"
            name="contact"
            value={formData.contact}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="login-form-group">
          <label className="login-label" htmlFor="password">
            Password:
          </label>
          <input
            className="login-input"
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit" disabled={loading} className="login-button">
          login
        </button>
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        {data && <p>Registration successful!</p>}
      </form>
    </div>
  );
};

export default Login;
