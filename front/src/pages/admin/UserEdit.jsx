/** @format */

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/UseAxiosPrivate";
import Sidebar from "../../components/admin/Sidebar";
import Navbar from "../../components/admin/Navbar";
import Modal from "../../components/admin/Modal";
import "../../assets/styles/admin/userEdit.css";

const UserEdit = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    province: "",
    city: "",
    street: "",
    apartment: "",
    postalCode: "",
    postalPhone: "",
    roles: [],
  });

  const [showModal, setShowModal] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axiosPrivate.get(`/admin/users/${id}`);
        setFormData(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    getUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRoleChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      roles: checked ? [name] : [],
    }));
    console.log(name);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axiosPrivate.put(`/admin/users/${id}`, formData);
      alert("User updated successfully");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      await axiosPrivate.delete(`/admin/users/${id}`);
      setShowModal(false);
      navigate("/admin/users");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="admin-user-edit-container">
      <Sidebar />
      <div className="edit-container">
        <Navbar />
        <form>
          <div className="user-edit-form-group">
            <input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
            />
            <label htmlFor="name">Name:</label>
          </div>
          <div className="user-edit-form-group">
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
            <label htmlFor="email">Email:</label>
          </div>
          <div className="user-edit-form-group">
            <input
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
            />
            <label htmlFor="phone">Phone:</label>
          </div>
          <div className="user-edit-form-group">
            <input
              name="postalCode"
              type="text"
              value={formData.postalCode}
              onChange={handleChange}
            />
            <label htmlFor="postalCode">Postal code:</label>
          </div>
          <div className="user-edit-form-group">
            <input
              name="postalPhone"
              type="text"
              value={formData.postalPhone}
              onChange={handleChange}
            />
            <label htmlFor="postalPhone">Postal phone:</label>
          </div>
          <div className="user-edit-form-group">
            <input
              name="province"
              type="text"
              value={formData.province}
              onChange={handleChange}
            />
            <label htmlFor="province">Province:</label>
          </div>
          <div className="user-edit-form-group">
            <input
              name="city"
              type="text"
              value={formData.city}
              onChange={handleChange}
            />
            <label htmlFor="city">city:</label>
          </div>
          <div className="user-edit-form-group">
            <input
              name="street"
              type="text"
              value={formData.street}
              onChange={handleChange}
            />
            <label htmlFor="street">street:</label>
          </div>
          <div className="user-edit-form-group">
            <input
              name="apartment"
              type="text"
              value={formData.apartment}
              onChange={handleChange}
            />
            <label htmlFor="apartment">apartment:</label>
          </div>
          <div className="checkbox-form-group">
            <label htmlFor="">
              role:
              <label htmlFor="admin">admin:</label>
              <input
                name="admin"
                type="checkbox"
                value="admin"
                checked={formData.roles.includes("admin")}
                onChange={handleRoleChange}
              />
              <label htmlFor="user">user:</label>
              <input
                name="user"
                type="checkbox"
                value="user"
                checked={formData.roles.includes("user")}
                onChange={handleRoleChange}
              />
            </label>
          </div>
          <div className="user-actions">
            <button onClick={handleUpdate}>Update</button>
            <button
              onClick={(e) => {
                e.preventDefault();
                setShowModal(true);
              }}
            >
              Delete
            </button>
          </div>
        </form>
        {showModal && (
          <Modal
            message="Are you sure you want to delete this user?"
            onConfirm={handleDelete}
            onCancel={() => setShowModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default UserEdit;
