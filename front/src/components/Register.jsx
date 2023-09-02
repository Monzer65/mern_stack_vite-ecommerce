/** @format */

/** @format */

import { useState } from "react";
import axios from "axios";

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

  // Handle the change events for the form fields
  const handleNameChange = (e) => {
    setName(e.target.value);
    setNameError(""); // Clear the name error when the user changes the input
  };

  const handleContactChange = (e) => {
    setContact(e.target.value);
    setContactError(""); // Clear the contact error when the user changes the input
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordError(""); // Clear the password error when the user changes the input
  };

  const handleRepeatPasswordChange = (e) => {
    setRepeatPassword(e.target.value);
    setRepeatPasswordError(""); // Clear the repeat password error when the user changes the input
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default browser behavior
    // Create an object with the form data
    const data = {
      name,
      contact,
      password,
      repeatPassword,
    };
    // Send a post request to the server route using axios
    axios
      .post("http://localhost:3000/api/auth/register", data)
      .then((response) => {
        console.log(response.data);
        setLoading(true);
        setRegistrationSuccess(true);
      })
      .catch((error) => {
        // Handle the error from the server
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
    <div className="register-form">
      <h1>Register</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
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
            />
            {nameError && <p className="error">{nameError}</p>}{" "}
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
            />
            {repeatPasswordError && (
              <p className="error">{repeatPasswordError}</p>
            )}{" "}
          </div>
          <button type="submit" className="auth-submit-button">
            Register
          </button>
        </form>
      )}
      {registrationSuccess && !loading && (
        <p className="success-message">Registration successful!</p>
      )}
    </div>
  );
};

export default RegisterForm;
