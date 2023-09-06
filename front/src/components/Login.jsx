/** @format */

import { useState } from "react";
import axios from "axios";
import { FaSpinner } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");

  const [contactError, setContactError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleContactChange = (e) => {
    setContact(e.target.value);
    setContactError("");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const data = {
      contact,
      password,
    };

    const token = localStorage.getItem("accessToken");
    if (token) {
      // User is already logged in, display a message or redirect
      // You can provide options like logging out or navigating to the user profile
      // Redirect to the user profile page, for example:
      navigate("/profile");
    } else {
      // User is not logged in, send login request
      axios
        .post("http://localhost:3000/api/auth/login", data)
        .then((response) => {
          if (response.status === 200) {
            // Store the access token in local storage
            localStorage.setItem("accessToken", response.data.accessToken);
            console.log(response.data);
            setLoading(false);
            window.location.href = `/`;
          }
        })
        .catch((error) => {
          setLoading(false);
          console.error(error);

          if (error.response.data.errors) {
            for (let err of error.response.data.errors) {
              switch (err.path) {
                case "contact":
                  setContactError(err.msg);
                  break;
                case "password":
                  setPasswordError(err.msg);
                  break;
                default:
                  break;
              }
            }
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">ورود</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="contact">Email or Phone</label>
          <input
            type="text"
            id="contact"
            name="contact"
            value={contact}
            onChange={handleContactChange}
            required
            disabled={loading}
          />
          {contactError && <p className="error">{contactError}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={handlePasswordChange}
            required
            disabled={loading}
          />
          {passwordError && <p className="error">{passwordError}</p>}{" "}
        </div>
        <button type="submit" disabled={loading} className="auth-submit-button">
          {loading ? <FaSpinner className="loading-icon" /> : "ورود"}
        </button>
      </form>
      <button className="go-to-link-button">
        <Link to="/register">ساخت حساب کاربری</Link>
      </button>
    </div>
  );
};
export default Login;
