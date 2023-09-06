/** @format */

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaSpinner, FaCheckCircle } from "react-icons/fa";

const VerificationForm = () => {
  const [contact, setContact] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [verifyError, setVerifyError] = useState(null);
  const [resendError, setResendError] = useState(null);

  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const contactFromParam = queryParams.get("contact");

  useEffect(() => {
    if (contactFromParam) {
      setContact(contactFromParam);
    } else {
      setContact("");
    }
  }, [contactFromParam]);

  const handleContactChange = (e) => {
    setContact(e.target.value);
  };

  const handleVerificationCodeChange = (e) => {
    setVerificationCode(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setVerifyLoading(true);
    setVerifyError(null);
    setSuccessMessage("");

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/verify",
        {
          contact,
          verificationCode,
        }
      );
      console.log(response.data);
      setVerifyLoading(false);
      if (response.status === 200) {
        // Store the accrefreshess token in cookie
        // document.cookie = `refreshToken=${
        //   response.data.refreshToken
        // }; HttpOnly; SameSite=Strict; Max-Age=${7 * 24 * 60 * 60};`;
        // Store the access token in local storage
        localStorage.setItem("accessToken", response.data.accessToken);

        setSuccessMessage(response.data.message);
        setVerifyLoading(true);
        setResendLoading(true);
        setTimeout(() => {
          setSuccessMessage("");
          navigate("/");
        }, 3000);
      }
    } catch (error) {
      console.error(error.response.data.errors);
      setVerifyLoading(false);
      setVerifyError(error.response.data);
    }
  };

  const handleResend = async (e) => {
    e.preventDefault();
    setResendLoading(true);
    setResendError(null);
    setSuccessMessage("");

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/resend",
        {
          contact,
          verificationCode,
        }
      );
      console.log(response.data);
      if (response.status === 200) {
        setSuccessMessage(response.data.message);
        setResendLoading(false);
      }
    } catch (error) {
      console.error(error.response.data.errors);

      setResendLoading(false);
      setResendError(error.response.data);
    }
  };

  return (
    <div className="form-container">
      <h1 className="form-title">تایید حساب کاربری</h1>
      <form onSubmit={handleSubmit} noValidate>
        <input
          type="hidden"
          id="contact"
          name="contact"
          value={contact}
          onChange={handleContactChange}
          required
          disabled
        />
        <input
          type="text"
          id="verificationCode"
          name="verificationCode"
          value={verificationCode}
          onChange={handleVerificationCodeChange}
          required
        />
        {verifyError && <p className="error">{verifyError.error}</p>}

        <button
          type="submit"
          disabled={verifyLoading || resendLoading}
          className={`auth-submit-button ${
            verifyLoading || resendLoading ? "disabled-button" : ""
          }`}
        >
          {verifyLoading ? <FaSpinner className="loading-icon" /> : "Verify"}
        </button>
      </form>

      <button
        onClick={handleResend}
        disabled={verifyLoading || resendLoading}
        className={`resend-code-button ${
          verifyLoading || resendLoading ? "disabled-button" : ""
        }`}
      >
        {resendLoading ? (
          <FaSpinner className="loading-icon" />
        ) : (
          "دریافت کد جدید"
        )}
      </button>
      {resendError && <p className="error">{resendError.error}</p>}

      {successMessage && (
        <div className="success-message">
          <FaCheckCircle className="success-icon" />
          <p className="success">{successMessage}</p>
        </div>
      )}
    </div>
  );
};

export default VerificationForm;
