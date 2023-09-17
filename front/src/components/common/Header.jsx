/** @format */

// Header.js
import Logo from "./Logo";
import SearchBox from "./SearchBox";
import Navigation from "../nav/Navigation";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="header">
      <div className="logo-deliver-container">
        <Logo />
      </div>
      <SearchBox />
      {name ? (
        <div>welcome {name}</div>
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
