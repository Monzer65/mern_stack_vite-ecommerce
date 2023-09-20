/** @format */

import useAxiosPrivate from "../hooks/UseAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import useLogout from "../hooks/UseLogout";

import { Link } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";

const UserProfile = () => {
  const logout = useLogout();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState("");
  const [name, setName] = useState("");
  const [editName, setEditName] = useState(false);

  const signOut = async () => {
    await logout();
    navigate("/");
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const fetchUserProfile = async () => {
      try {
        const response = await axiosPrivate.get("/profile", {
          signal: controller.signal,
        });
        console.log(response.data.profile);

        isMounted && setName(response.data.profile.name);
        isMounted && setProfile(response.data.profile);
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

  const updateName = async (newValue) => {
    setLoading(true);

    try {
      await axiosPrivate.put("/profile/update-name", {
        name: newValue,
      });
      toggleEditMode(false);
      setName(newValue);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error updating name:", error);
    }
  };

  const toggleEditMode = (editMode) => {
    setEditName(editMode);
  };

  return (
    <div>
      <h1>User Profile</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <div>
        {editName ? (
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button disabled={loading} onClick={() => updateName(name)}>
              {loading ? <FaSpinner className="loading-icon" /> : "update"}
            </button>
          </div>
        ) : (
          <div>
            <p>Name: {name}</p>
            <button
              disabled={loading}
              onClick={() => toggleEditMode("name", true)}
            >
              {loading ? <FaSpinner className="loading-icon" /> : "edit"}
            </button>
          </div>
        )}
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
