/** @format */
import "../../assets/styles/admin/navbar.css";
import {
  IoSearchOutline,
  IoLanguage,
  IoNotifications,
  IoChatbubbleEllipses,
  IoListOutline,
} from "react-icons/io5";
import { MdDarkMode, MdOutlineFullscreen } from "react-icons/md";

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="wrapper">
        <div className="search">
          <input type="text" placeholder="Search..." />
          <IoSearchOutline />
        </div>
        <div className="items">
          <div className="item">
            <IoLanguage className="icon" />
            English
          </div>
          <div className="item">
            <MdDarkMode
              className="icon"
              // onClick={() => dispatch({ type: "TOGGLE" })}
            />
          </div>
          <div className="item">
            <MdOutlineFullscreen className="icon" />
          </div>
          <div className="item">
            <IoNotifications className="icon" />
            <div className="counter">1</div>
          </div>
          <div className="item">
            <IoChatbubbleEllipses className="icon" />
            <div className="counter">2</div>
          </div>
          <div className="item">
            <IoListOutline className="icon" />
          </div>
          <div className="item">
            <img
              src="https://images.pexels.com/photos/941693/pexels-photo-941693.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
              alt=""
              className="avatar"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
