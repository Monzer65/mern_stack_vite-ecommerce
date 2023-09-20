/** @format */

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaSpinner, FaCheckCircle } from "react-icons/fa";
import Axios from "../api/Axios";
import useAuth from "../hooks/UseAuth";

const VerificationForm = () => {
  const { setAuth } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const queryParams = new URLSearchParams(location.search);
  const contactFromParam = queryParams.get("contact");

  const [contact, setContact] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [verifyError, setVerifyError] = useState(null);
  const [resendError, setResendError] = useState(null);

  const [successMessage, setSuccessMessage] = useState("");

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
      const response = await Axios.post(
        "/auth/verify",
        JSON.stringify({ contact, verificationCode }),
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log(JSON.stringify(response.data));
      const user = response?.data;
      const accessToken = response?.data?.accessToken;
      const roles = response?.data?.roles;
      setAuth({ user, roles, accessToken });
      setAuth((prevAuth) => ({
        ...prevAuth,
        accessToken,
      }));

      setVerifyLoading(false);
      setContact("");
      setVerificationCode("");
      setSuccessMessage(response.data.message);
      setTimeout(() => {
        setSuccessMessage("");
        navigate(from, { replace: true });
      }, 3000);
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
      const response = await Axios.post(
        "/auth/resend",
        JSON.stringify({ contact, verificationCode }),
        {
          headers: {
            "Content-Type": "application/json",
          },
          // withCredentials: true,
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
          style={{ direction: "ltr" }}
        />
        {verifyError && <p className="error">{verifyError.error}</p>}

        <button
          type="submit"
          disabled={verifyLoading || resendLoading}
          className={`auth-submit-button ${
            verifyLoading || resendLoading ? "disabled-button" : ""
          }`}
        >
          {verifyLoading ? <FaSpinner className="loading-icon" /> : "ارسال"}
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
