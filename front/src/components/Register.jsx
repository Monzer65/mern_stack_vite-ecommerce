/** @format */

import { useState } from "react";
import axios from "axios";
import { FaSpinner } from "react-icons/fa";

const RegisterForm = () => {
  // Initialize the state variables for the form fields
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  // Initialize the state variables for the errors
  const [nameError, setNameError] = useState("");
  const [contactError, setContactError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [repeatPasswordError, setRepeatPasswordError] = useState("");

  const [loading, setLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const handleNameChange = (e) => {
    setName(e.target.value);
    setNameError("");
  };

  const handleContactChange = (e) => {
    setContact(e.target.value);
    setContactError("");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordError("");
  };

  const handleRepeatPasswordChange = (e) => {
    setRepeatPassword(e.target.value);
    setRepeatPasswordError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const data = {
      name,
      contact,
      password,
      repeatPassword,
    };
    axios
      .post("http://localhost:3000/api/auth/register", data)
      .then((response) => {
        console.log(response.data);

        setLoading(false);
        setRegistrationSuccess(true);
        window.location.href = `/verify?contact=${encodeURIComponent(contact)}`;
      })
      .catch((error) => {
        setLoading(false);
        console.error(error.response.data.errors);

        // Set the errors for each field based on the error messages from the server
        if (error.response.data.errors) {
          // Loop through the errors array
          for (let err of error.response.data.errors) {
            // Check the path property of each error object
            switch (err.path) {
              case "name":
                // Set the name error state variable
                setNameError(err.msg);
                break;
              case "contact":
                // Set the contact error state variable
                setContactError(err.msg);
                break;
              case "password":
                // Set the password error state variable
                setPasswordError(err.msg);
                break;
              case "repeatPassword":
                // Set the repeat password error state variable
                setRepeatPasswordError(err.msg);
                break;
              default:
                // Do nothing for other cases
                break;
            }
          }
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="form-container">
      <h1 className="form-title">ثبت نام</h1>
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={handleNameChange}
            required
            disabled={loading}
          />
          {nameError && <p className="error">{nameError}</p>}
        </div>
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
        <div className="form-group">
          <label htmlFor="repeatPassword">Repeat Password</label>
          <input
            type="password"
            id="repeatPassword"
            name="repeatPassword"
            value={repeatPassword}
            onChange={handleRepeatPasswordChange}
            required
            disabled={loading}
          />
          {repeatPasswordError && (
            <p className="error">{repeatPasswordError}</p>
          )}{" "}
        </div>
        <button
          type="submit"
          className={`auth-submit-button ${loading ? "disabled-button" : ""}`}
        >
          {loading ? <FaSpinner className="loading-icon" /> : "ثبت نام"}
        </button>
      </form>
      {registrationSuccess && !loading && (
        <p className="success-message">Registration successful!</p>
      )}
    </div>
  );
};

export default RegisterForm;
