/** @format */
import { useState } from "react";
import "../../assets/styles/admin/sidebar.css";
import logo from "../../assets/logos/mainLogo.png";
import { BiSolidDashboard } from "react-icons/bi";
import {
  IoPersonOutline,
  // IoSettingsOutline,
  IoNotifications,
} from "react-icons/io5";
import {
  MdLocalShipping,
  MdOutlinePsychologyAlt,
  MdAccountCircle,
  MdHealthAndSafety,
} from "react-icons/md";
import { BsCreditCard2Back } from "react-icons/bs";
import { FaStore } from "react-icons/fa6";
import { AiFillPieChart, AiFillSetting } from "react-icons/ai";
import { ImExit } from "react-icons/im";
import { Link } from "react-router-dom";
import useLogout from "../../hooks/UseLogout";
import { useUserContext } from "../../contexts/UserNameContext";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const { setUserProfile } = useUserContext();
  const logout = useLogout();
  const signOut = async () => {
    await logout();
    localStorage.removeItem("userName");
    setUserProfile("");
    navigate("/");
  };
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className={`sidebar-container ${sidebarOpen ? "open" : ""}`}>
      <div className="toggle-button" onClick={toggleSidebar}>
        {sidebarOpen ? "<" : ">"}
      </div>
      <div className="sidebar">
        <div className="top">
          <Link to="/" style={{ textDecoration: "none" }}>
            <img src={logo} alt="site logo" width={"60px"} className="logo" />
          </Link>
        </div>
        <hr />
        <div className="center">
          <ul>
            <p className="title">MAIN</p>
            <Link to={"/admin"}>
              <li>
                <BiSolidDashboard className="icon" />
                <span>Dashboard</span>
              </li>
            </Link>
            <p className="title">LISTS</p>
            <Link to="/admin/users" style={{ textDecoration: "none" }}>
              <li>
                <IoPersonOutline className="icon" />
                <span>Users</span>
              </li>
            </Link>
            <Link to="/products" style={{ textDecoration: "none" }}>
              <li>
                <FaStore className="icon" />
                <span>Products</span>
              </li>
            </Link>
            <li>
              <BsCreditCard2Back className="icon" />
              <span>Orders</span>
            </li>
            <li>
              <MdLocalShipping className="icon" />
              <span>Delivery</span>
            </li>
            <p className="title">USEFUL</p>
            <li>
              <AiFillPieChart className="icon" />
              <span>Stats</span>
            </li>
            <li>
              <IoNotifications className="icon" />
              <span>Notifications</span>
            </li>
            <p className="title">SERVICE</p>
            <li>
              <MdHealthAndSafety className="icon" />
              <span>System Health</span>
            </li>
            <li>
              <MdOutlinePsychologyAlt className="icon" />
              <span>Logs</span>
            </li>
            <li>
              <AiFillSetting className="icon" />
              <span>Settings</span>
            </li>
            <p className="title">USER</p>
            <li>
              <MdAccountCircle className="icon" />
              <span>Profile</span>
            </li>
            <li onClick={signOut}>
              <ImExit className="icon" />
              <span>Logout</span>
            </li>
          </ul>
        </div>
        <div className="bottom">
          <div
            className="colorOption"
            // onClick={() => dispatch({ type: "LIGHT" })}
          ></div>
          <div
            className="colorOption"
            // onClick={() => dispatch({ type: "DARK" })}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
