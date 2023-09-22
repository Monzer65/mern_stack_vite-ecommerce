/** @format */

import { useEffect } from "react";
import { useUserContext } from "../contexts/UserNameContext";
import Logo from "./Logo";
import SearchBox from "./SearchBox";
import Navigation from "./Navigation";
import { Link } from "react-router-dom";
import "../assets/styles/header.css";

function Header() {
  const { userName, setUserProfile } = useUserContext();

  useEffect(() => {
    const storedUserName = localStorage.getItem("userName");

    if (storedUserName && userName !== storedUserName) {
      setUserProfile(storedUserName);
    } else if (!storedUserName && userName) {
      // If there is no userName in localStorage but it's in context, clear it
      setUserProfile(""); // or setUserProfile(null) depending on your implementation
    }
  }, [userName, setUserProfile]);

  return (
    <header className="header">
      <div className="logo-deliver-container">
        <Logo />
      </div>
      <SearchBox />
      {userName ? (
        <div>welcome {userName}</div>
      ) : (
        <Link to="/login">
          <div>ثبت نام/ورود</div>
        </Link>
      )}
      <Navigation />
    </header>
  );
}

export default Header;
