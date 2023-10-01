/** @format */

import { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/UseAxiosPrivate";
import "../../assets/styles/admin/usersList.css";
import Sidebar from "../../components/admin/Sidebar";
import Navbar from "../../components/admin/Navbar";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { ImSpinner2 } from "react-icons/im";

const UsersList = () => {
  const [users, setUsers] = useState();
  const axiosPrivate = useAxiosPrivate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await axiosPrivate.get("/admin/users", {});
        setUsers(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getUsers();
  }, []);

  return (
    <div className="users-list">
      <Sidebar />
      <div className="listContainer">
        <Navbar /> <h2>لیست کاربرها</h2>
        <UsersTable users={users} loading={loading} />
      </div>
    </div>
  );
};

const UsersTable = ({ users, loading }) => {
  return (
    <>
      {loading ? (
        <ImSpinner2 className="loading-icon-products" />
      ) : (
        <>
          {users.length ? (
            <table>
              <thead>
                <tr>
                  <th>نام</th> <th>کاربر تایید شده</th> <th>نقش</th>
                  <th>تاریخ ثبت نام</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, i) => (
                  <tr key={i}>
                    <td>
                      <Link to={`${user._id}`}>{user?.name}</Link>
                    </td>
                    <td>{user?.isVerified ? "✔️" : ""}</td>
                    <td>{user?.roles.join(", ")}</td> <td>{user?.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>no users to display</p>
          )}
        </>
      )}
    </>
  );
};

UsersTable.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      isVerified: PropTypes.bool.isRequired,
      roles: PropTypes.arrayOf(PropTypes.string).isRequired,
      createdAt: PropTypes.string.isRequired,
    })
  ),
  loading: PropTypes.bool.isRequired,
};

export default UsersList;
