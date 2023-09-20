/** @format */

import { useRef, useState, useEffect } from "react";
import axios from "axios";
import { FaSpinner } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const nameRef = useRef();
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

  const [error, setError] = useState("");
  const [showErrorLink, setShowErrorLink] = useState(false);

  const [loading, setLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const navigate = useNavigate();

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
        navigate(`/verify?contact=${encodeURIComponent(contact)}`);
      })
      .catch((error) => {
        if (error.response && error.response.status === 409) {
          // Handle the specific error condition here
          setError("شما قبلا درخواست کد داده اید");
          setShowErrorLink(true);
        } else {
          setLoading(false);
          console.error(error.response.data);

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
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    nameRef.current.focus();
  }, []);

  return (
    <div className="form-container">
      <h1 className="form-title">ثبت نام</h1>
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="name">نام</label>
          <input
            type="text"
            id="name"
            ref={nameRef}
            name="name"
            autoComplete="off"
            value={name}
            onChange={handleNameChange}
            required
            disabled={loading}
          />
          {nameError && <p className="error">{nameError}</p>}{" "}
        </div>
        <div className="form-group">
          <label htmlFor="contact">تلفن یا ایمیل</label>
          <input
            type="text"
            id="contact"
            name="contact"
            autoComplete="off"
            value={contact}
            onChange={handleContactChange}
            required
            disabled={loading}
          />
          {contactError && <p className="error">{contactError}</p>}{" "}
        </div>
        <div className="form-group">
          <label htmlFor="password">پسورد</label>
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
          <label htmlFor="repeatPassword">تکرار پسورد</label>
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
          {loading ? <FaSpinner className="loading-icon" /> : "ارسال"}
        </button>
      </form>
      {error && (
        <div>
          <p className="error">{error}</p>
          {showErrorLink && (
            <p>
              <Link to={`/verify?contact=${encodeURIComponent(contact)}`}>
                اینجا
              </Link>{" "}
              کلیک کنید تا بتوانید کد را وارد کنید
            </p>
          )}
        </div>
      )}
      {registrationSuccess && !loading && (
        <p className="success-message">Registration successful!</p>
      )}
      <p>
        حساب دارید؟ <Link to="/login">وارد شوید</Link>
      </p>
    </div>
  );
};

export default RegisterForm;
