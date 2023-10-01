/** @format */

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import useAxiosPrivate from "../../hooks/UseAxiosPrivate";
import Sidebar from "../../components/admin/Sidebar";
import Navbar from "../../components/admin/Navbar";
import Chart from "../../components/admin/Chart";
import "../../assets/styles/admin/userDetail.css";

const UserDetail = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    province: "",
    city: "",
    street: "",
    apartment: "",
    postalCode: "",
    postalPhone: "",
    roles: "",
  });
  const { id } = useParams();
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axiosPrivate.get(`/admin/users/${id}`);
        setUserData(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    getUser();
  }, [id]);

  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <div className="top-part">
          <div className="left-part">
            <Link to={`edit`}>
              <div className="editButton">Edit</div>
            </Link>

            <h1 className="title">Information</h1>
            <div className="item">
              <img
                src="https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260"
                alt=""
                className="itemImg"
              />
              <div className="details">
                <div className="detailItem">
                  <span className="itemKey">Name:</span>
                  <span className="itemValue">{userData.name}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Role:</span>
                  <span className="itemValue">{userData.roles}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Email:</span>
                  <span className="itemValue">{userData.email}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Phone:</span>
                  <span className="itemValue">{userData.phone}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Address:</span>
                  <span className="itemValue">
                    {userData.city}-{userData.street}-{userData.apartment}
                  </span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Province:</span>
                  <span className="itemValue">{userData.province}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="right-part">
            <Chart aspect={3 / 1} title="User Spending ( Last 6 Months)" />
          </div>
        </div>
        <div className="bottom-part">
          <h1 className="title">Last Transactions</h1>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
