/** @format */

import { useRef, useState, useEffect, useContext } from "react";
import { useUserContext } from "../contexts/UserNameContext";
import logo from "../assets/logos/mainLogo.png";
import SearchBox from "./SearchBox";
import { Link, useNavigate } from "react-router-dom";
import "../assets/styles/header.css";
import useLogout from "../hooks/UseLogout";
import {
  FaSignInAlt,
  FaSignOutAlt,
  FaAngleLeft,
  FaAngleDown,
  FaUserAlt,
  FaClipboardList,
  FaThList,
  FaShoppingCart,
  FaCog,
} from "react-icons/fa";
import { SiGnuprivacyguard } from "react-icons/si";
import { CartContext } from "../contexts/CartContext";
import useAuth from "../hooks/UseAuth";
import jwt_decode from "jwt-decode";

function Header() {
  const { userName, setUserProfile } = useUserContext();
  const logout = useLogout();
  const navigate = useNavigate();
  const ref = useRef();
  const [isOpen, setIsOpen] = useState(false);
  const { cartItems } = useContext(CartContext);
  const { auth } = useAuth();
  const decoded = auth?.accessToken ? jwt_decode(auth.accessToken) : undefined;
  const roles = decoded?.roles || [];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      // If the menu is open and the clicked target is not within the menu,
      // then close the menu
      if (isOpen && ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", checkIfClickedOutside);
    return () => {
      // remove the event listener on cleanup
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    const storedUserName = localStorage.getItem("userName");

    if (storedUserName && userName !== storedUserName) {
      setUserProfile(storedUserName);
    }
  }, [userName, setUserProfile]);

  const signOut = async () => {
    await logout();
    localStorage.removeItem("userName");
    setUserProfile("");
    navigate("/");
  };

  return (
    <>
      <header>
        <div className="logo-container">
          <Link to="/">
            <img src={logo} className="logo" alt="site logo" />
          </Link>
        </div>
        <div className="searchbox-container">
          <SearchBox />
        </div>
        <div className="nav-container">
          <>
            {userName ? (
              <div className="dropdown">
                <button onClick={toggleMenu} className="dropbtn">
                  {isOpen ? <FaAngleDown /> : <FaAngleLeft />}
                </button>
                <Link to={"/profile"} className="fetched-username">
                  {userName}، سلام
                </Link>
                {isOpen && (
                  <div
                    className="dropdown-content"
                    ref={ref}
                    onClick={toggleMenu}
                  >
                    {roles.includes("admin") && (
                      <Link to={"/admin"}>
                        <span>پنل مدیریت</span>
                        <span>
                          <FaCog />
                        </span>
                      </Link>
                    )}
                    <Link to={"/profile"}>
                      <span>پروفایل </span>
                      <span>
                        <FaUserAlt />
                      </span>
                    </Link>
                    <Link>
                      <span>سفارشات من </span>
                      <span>
                        <FaClipboardList />
                      </span>
                    </Link>
                    <Link>
                      <span>لیست تماشا </span>
                      <span>
                        <FaThList />
                      </span>
                    </Link>
                    <Link onClick={signOut} className="exit-btn">
                      <span>خروج </span>
                      <span>
                        <FaSignOutAlt />
                      </span>
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="login-signup-links">
                <Link to={"/register"}>
                  <SiGnuprivacyguard />
                  <span>ثبت نام</span>
                </Link>
                <Link to="/login">
                  <FaSignInAlt />
                  <span>ورود</span>
                </Link>
              </div>
            )}
          </>
          <div className="cart">
            <Link to={"/cart"} className="cart-link">
              <span className="cart-icon">
                <FaShoppingCart />
              </span>
              <span className="counter">{cartItems.length}</span>
              <span className="sabad">سبد</span>
            </Link>
          </div>
        </div>
      </header>
      <div className="searchbox-container-mobile">
        <SearchBox />
      </div>
    </>
  );
}

export default Header;
