/** @format */

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAxiosPrivate from "../hooks/UseAxiosPrivate";
import useLogout from "../hooks/UseLogout";
import { Link } from "react-router-dom";
import { useUserContext } from "../contexts/UserNameContext";
import "../assets/styles/userProfile.css";

const UserProfile = () => {
  const axiosPrivate = useAxiosPrivate();
  const location = useLocation();
  const logout = useLogout();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState("");
  const { setUserProfile } = useUserContext();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const fetchUserProfile = async () => {
      try {
        const response = await axiosPrivate.get("/profile", {
          signal: controller.signal,
        });

        isMounted && setProfile(response.data.profile);
        setUserProfile(response.data.profile.name);
      } catch (err) {
        console.error("profile error:", err);
        setError(error.response.data.error);
        navigate("/login", { state: { from: location }, replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const signOut = async () => {
    await logout();
    localStorage.removeItem("userName");
    setUserProfile("");
    navigate("/");
  };

  return (
    <div className="profile-wrapper">
      <h1>اطلاعات حساب کاربری</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <div className="profile-contianer">
        <div className="profile-field">
          <p>نام: {profile.name}</p>
          <Link to={"/profile/update-name"}>ویرایش</Link>
        </div>
        <div className="profile-field">
          <p>ایمیل: {profile.email}</p>
          <Link to={"/profile/update-email"}>ویرایش</Link>
        </div>
        <div className="profile-field">
          <p>تلفن اصلی: {profile.phone}</p>
          <Link to={"/profile/update-phone"}>ویرایش</Link>
        </div>
        <div className="profile-field">
          <p>پسورد: (غیرقابل نمایش)</p>
          <Link to={"/profile/update-password"}>ویرایش</Link>
        </div>
        <div className="profile-field address-field">
          <ul className="address">
            <h3>آدرس:</h3>
            <li>استان: {profile.province}</li>
            <li>شهرستان: {profile.city}</li>
            <li>خیابان و کوچه: {profile.street}</li>
            <li>پلاک: {profile.apartment}</li>
            <li>کد پستی: {profile.postalCode}</li>
            <li>تلفن پستی: {profile.postalPhone}</li>
          </ul>
          <Link to={"/profile/update-address"}>ویرایش</Link>
        </div>
      </div>
      <button onClick={signOut} className="profile-exit-btn">
        خروج
      </button>
    </div>
  );
};

export default UserProfile;
