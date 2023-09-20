/** @format */

import { useState } from "react";
import useAxiosPrivate from "../hooks/UseAxiosPrivate";
import { useNavigate } from "react-router-dom";

function EmailVerificationForm() {
  const axiosPrivate = useAxiosPrivate();

  const [verificationCode, setVerificationCode] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const handleVerification = async () => {
    try {
      const response = await axiosPrivate.post(
        "/profile/update-email/verify-email",
        {
          verificationCode,
        }
      );

      const data = response.data;

      if (response.status === 200) {
        setMessage(data.message);
        setTimeout(() => {
          navigate("/profile");
        }, 2000);
      } else {
        setMessage(data);
      }
    } catch (error) {
      console.error("Error during email verification:", error);
      setMessage("Server error");
    }
  };

  return (
    <div>
      <h1>Email Verification</h1>
      <div>
        <label>Verification Code:</label>
        <input
          type="text"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
        />
      </div>
      <button onClick={handleVerification}>Verify Email</button>
      <div>{message}</div>
    </div>
  );
}

export default EmailVerificationForm;
