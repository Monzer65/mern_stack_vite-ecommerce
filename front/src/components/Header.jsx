/** @format */

// Header.js
import Logo from "./Logo";
import SearchBox from "./SearchBox";
import Navigation from "./Navigation";
import { Link } from "react-router-dom";
import useAuth from "../hooks/UseAuth";

function Header() {
  const { auth } = useAuth();
  console.log(auth.userName);
  return (
    <header className="header">
      <div className="logo-deliver-container">
        <Logo />
      </div>
      <SearchBox />
      {auth?.userName ? (
        <div>welcome {auth?.userName}</div>
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
