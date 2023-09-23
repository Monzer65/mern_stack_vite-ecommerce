/** @format */

import { useRef, useState, useEffect, useContext } from "react";
import { useUserContext } from "../contexts/UserNameContext";
import logo from "../assets/logos/mainLogo.png";
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
} from "react-icons/fa";
import { SiGnuprivacyguard } from "react-icons/si";
import { CartContext } from "../contexts/CartContext";

function Header() {
  const { userName, setUserProfile } = useUserContext();
  const logout = useLogout();
  const navigate = useNavigate();
  const ref = useRef();
  const [isOpen, setIsOpen] = useState(false);
  const { cartItems } = useContext(CartContext);

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
    // add the event listener
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
    <header>
      <ul>
        <li>
          <Link to="/">
            <img src={logo} className="logo" alt="site logo" />
          </Link>
        </li>
        <li className="dropdown">
          {userName ? (
            <div onClick={toggleMenu}>
              <button>{isOpen ? <FaAngleDown /> : <FaAngleLeft />}</button>
              <Link to={"/profile"} className="dropbtn">
                {userName}، سلام
              </Link>
              {isOpen && (
                <div className="dropdown-content" ref={ref}>
                  <Link to={"/profile"}>
                    پروفایل <FaUserAlt />
                  </Link>
                  <Link>
                    سفارشات من <FaClipboardList />
                  </Link>
                  <Link>
                    لیست تماشا <FaThList />
                  </Link>
                  <Link onClick={signOut} className="exit-btn">
                    خروج <FaSignOutAlt />
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to={"/register"}>
                <div className="header-nav">
                  <div>ثبت نام</div>
                  <SiGnuprivacyguard />
                </div>
              </Link>
              <Link to="/login">
                <div className="header-nav">
                  <div>ورود</div>
                  <FaSignInAlt />
                </div>
              </Link>
            </>
          )}
          <Link to={"/cart"} className="header-cart-logo">
            <div className="header-nav">
              سبد
              <FaShoppingCart />
              <span className="cart-length">{cartItems.length}</span>
            </div>
          </Link>
        </li>
      </ul>
    </header>
  );
}

export default Header;
