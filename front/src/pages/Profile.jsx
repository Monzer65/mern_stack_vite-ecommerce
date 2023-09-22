/** @format */

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAxiosPrivate from "../hooks/UseAxiosPrivate";
import useLogout from "../hooks/UseLogout";
import { Link } from "react-router-dom";
import { useUserContext } from "../contexts/UserNameContext";

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
    <div>
      <h1>User Profile</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <div>
        <div>
          <p>Name: {profile.name}</p>
          <Link to={"/profile/update-name"}>edit</Link>
        </div>
        <div>
          <p>Email: {profile.email}</p>
          <Link to={"/profile/update-email"}>edit</Link>
        </div>
        <div>
          <p>Phone: {profile.phone}</p>
          <Link to={"/profile/update-phone"}>edit</Link>
        </div>
        <div>
          <p>Password:</p>
          <button>
            <Link to={"/profile/update-password"}>edit</Link>
          </button>
        </div>
        <div>
          <p>
            Address:
            <span>province: {profile.province} </span>
            <span>city: {profile.city} </span>
            <span>street: {profile.street} </span>
            <span>apartment: {profile.apartment} </span>
            <span>postal code:{profile.postalCode} </span>
            <span>postal phone:{profile.postalPhone} </span>
          </p>
          <Link to={"/profile/update-address"}>edit</Link>
        </div>
      </div>
      <button onClick={signOut}>خروج</button>
    </div>
  );
};

export default UserProfile;
