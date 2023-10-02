/** @format */

import { useState } from "react";
import useAxiosPrivate from "../../hooks/UseAxiosPrivate";
import "../../assets/styles/admin/userCreate.css";
import Sidebar from "../../components/admin/Sidebar";
import Navbar from "../../components/admin/Navbar";

function UserCreate() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [roles, setRoles] = useState([]);

  const [message, setMessage] = useState("");

  const axiosPrivate = useAxiosPrivate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const user = {
      name,
      email,
      phone,
      password,
      roles,
    };

    try {
      const response = await axiosPrivate.post("/admin/users/new", user);

      setMessage(`User created successfully: ${JSON.stringify(response.data)}`);
    } catch (error) {
      setMessage(`User creation failed: ${error.message}`);
    }
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleRolesChange = (e) => {
    const options = e.target.options;

    const values = [];

    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        values.push(options[i].value);
      }
    }

    setRoles(values);
  };

  return (
    <div className="create-user-container">
      <Sidebar />
      <div className="create-user">
        <Navbar />
        <h1>Create a new user</h1>
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={handleNameChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={handlePhoneChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="roles">Roles</label>
            <select id="roles" multiple onChange={handleRolesChange}>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>
          <button type="submit">Create user</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}

export default UserCreate;
