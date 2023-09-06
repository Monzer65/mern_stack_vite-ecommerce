/** @format */

import axiosInstance from "./AxiosInstance";
import { useState, useEffect } from "react";

const UserProfile = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State variables for each field and edit mode
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [apartment, setApartment] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");

  // State variables to track edit mode for each field
  const [editName, setEditName] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [editPhone, setEditPhone] = useState(false);
  const [editPostalCode, setEditPostalCode] = useState(false);
  const [editApartment, setEditApartment] = useState(false);
  const [editStreet, setEditStreet] = useState(false);
  const [editCity, setEditCity] = useState(false);
  const [editProvince, setEditProvince] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axiosInstance.get("/profile");
        const user = response.data.profile;
        // Initialize state variables with user data
        setName(user.name);
        setEmail(user.email);
        setPhone(user.phone);
        setPostalCode(user.postalCode);
        setApartment(user.apartment);
        setStreet(user.street);
        setCity(user.city);
        setProvince(user.province);

        setLoading(false);
      } catch (error) {
        setError(error.response.data);
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Function to update a field on the server
  const updateField = async (fieldName, newValue) => {
    try {
      await axiosInstance.put(`/profile/update-${fieldName}`, {
        value: newValue,
      });
      // Update the corresponding state variable
      switch (fieldName) {
        case "name":
          setName(newValue);
          break;
        case "email":
          setEmail(newValue);
          break;
        case "Phone":
          setPhone(newValue);
          break;
        case "postalCode":
          setPostalCode(newValue);
          break;
        case "apartment":
          setApartment(newValue);
          break;
        case "street":
          setStreet(newValue);
          break;
        case "city":
          setCity(newValue);
          break;
        case "province":
          setProvince(newValue);
          break;
        default:
          break;
      }
      // Disable edit mode
      toggleEditMode(fieldName, false);
    } catch (error) {
      // Handle errors
      console.error("Error updating field:", error);
    }
  };

  // Function to toggle edit mode for a field
  const toggleEditMode = (fieldName, editMode) => {
    switch (fieldName) {
      case "name":
        setEditName(editMode);
        break;
      case "email":
        setEditEmail(editMode);
        break;
      case "Phone":
        setEditPhone(editMode);
        break;
      case "postalCode":
        setEditPostalCode(editMode);
        break;
      case "apartment":
        setEditApartment(editMode);
        break;
      case "street":
        setEditStreet(editMode);
        break;
      case "city":
        setEditCity(editMode);
        break;
      case "province":
        setEditProvince(editMode);
        break;
      default:
        break;
    }
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
            <button onClick={() => updateField("name", name)}>Update</button>
          </div>
        ) : (
          <div>
            <p>Name: {name}</p>
            <button onClick={() => toggleEditMode("name", true)}>Edit</button>
          </div>
        )}
        {editEmail ? (
          <div>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={() => updateField("email", email)}>Update</button>
          </div>
        ) : (
          <div>
            <p>Email: {email}</p>
            <button onClick={() => toggleEditMode("email", true)}>Edit</button>
          </div>
        )}
        {editPhone ? (
          <div>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <button onClick={() => updateField("phone", phone)}>Update</button>
          </div>
        ) : (
          <div>
            <p>Phone: {phone}</p>
            <button onClick={() => toggleEditMode("phone", true)}>Edit</button>
          </div>
        )}
        {editPostalCode ? (
          <div>
            <input
              type="text"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
            />
            <button onClick={() => updateField("postalCode", postalCode)}>
              Update
            </button>
          </div>
        ) : (
          <div>
            <p>postal code: {postalCode}</p>
            <button onClick={() => toggleEditMode("postalCode", true)}>
              Edit
            </button>
          </div>
        )}
        {editApartment ? (
          <div>
            <input
              type="text"
              value={apartment}
              onChange={(e) => setApartment(e.target.value)}
            />
            <button onClick={() => updateField("apartment", apartment)}>
              Update
            </button>
          </div>
        ) : (
          <div>
            <p>apartment: {apartment}</p>
            <button onClick={() => toggleEditMode("apartment", true)}>
              Edit
            </button>
          </div>
        )}
        {editStreet ? (
          <div>
            <input
              type="text"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
            />
            <button onClick={() => updateField("street", street)}>
              Update
            </button>
          </div>
        ) : (
          <div>
            <p>street: {street}</p>
            <button onClick={() => toggleEditMode("street", true)}>Edit</button>
          </div>
        )}
        {editCity ? (
          <div>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <button onClick={() => updateField("city", street)}>Update</button>
          </div>
        ) : (
          <div>
            <p>city: {city}</p>
            <button onClick={() => toggleEditMode("city", true)}>Edit</button>
          </div>
        )}
        {editProvince ? (
          <div>
            <input
              type="text"
              value={province}
              onChange={(e) => setProvince(e.target.value)}
            />
            <button onClick={() => updateField("province", province)}>
              Update
            </button>
          </div>
        ) : (
          <div>
            <p>province: {province}</p>
            <button onClick={() => toggleEditMode("province", true)}>
              Edit
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
