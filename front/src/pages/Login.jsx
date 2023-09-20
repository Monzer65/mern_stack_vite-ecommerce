/** @format */

import { useRef, useState, useEffect } from "react";
import useAuth from "../hooks/UseAuth";
import axios from "../api/Axios";
import { FaSpinner } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Login = () => {
  const { setAuth, persist, setPersist } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const nameRef = useRef();

  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");

  const [contactError, setContactError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleContactChange = (e) => {
    setContact(e.target.value);
    setContactError("");
    setErrorMsg("");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordError("");
    setErrorMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "/auth/login",
        JSON.stringify({ contact, password }),
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      const accessToken = response?.data?.accessToken;
      const roles = response?.data?.roles;
      const userName = response?.data?.userName;

      setAuth({ contact, password, roles, accessToken, userName });

      setContact("");
      setPassword("");
      setLoading(false);

      navigate(from, { replace: true });
    } catch (error) {
      if (!error?.response) {
        setErrorMsg("no server response");
      } else if (error.response.data.errors) {
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
      } else if (error?.response?.status === 404) {
        setContactError(error.response.data.error);
      } else if (error?.response?.status === 401) {
        setErrorMsg(error.response.data.error);
      } else {
        setErrorMsg("failed login");
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    nameRef.current.focus();
  }, []);

  const togglePersist = () => {
    setPersist((prev) => !prev);
  };

  useEffect(() => {
    localStorage.setItem("persist", persist);
  }, [persist]);

  return (
    <>
      <div className="form-container">
        <h2 className="form-title">ورود</h2>
        <form onSubmit={handleSubmit} noValidate>
          <p className="error">{errorMsg}</p>
          <div className="form-group">
            <label htmlFor="contact">Email or Phone</label>
            <input
              type="text"
              ref={nameRef}
              id="contact"
              name="contact"
              autoComplete="off"
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
          <button
            type="submit"
            disabled={loading}
            className="auth-submit-button"
          >
            {loading ? <FaSpinner className="loading-icon" /> : "ورود"}
          </button>
          <div className="persistCheck">
            <input
              type="checkbox"
              id="persist"
              onChange={togglePersist}
              checked={persist}
            />
            <label htmlFor="persist">Trust This Device</label>
          </div>
        </form>
        <p>
          ثبت نام نکرده اید؟
          <Link to="/register"> حساب کاربری بسازید </Link>
        </p>
      </div>
    </>
  );
};
export default Login;
