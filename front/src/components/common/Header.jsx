/** @format */

// Header.js
import Logo from "./Logo";
import SearchBox from "./SearchBox";
import Navigation from "../nav/Navigation";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
// import { useState, useEffect } from "react";

function Header({ setResults, setError }) {
  return (
    <header className="header">
      <div className="logo-deliver-container">
        <Logo />
      </div>
      <SearchBox setResults={setResults} setError={setError} />
      <Link to="/login">
        <div>ثبت نام/ورود</div>
      </Link>
      <Navigation />
    </header>
  );
}

Header.propTypes = {
  setResults: PropTypes.func.isRequired,
  setError: PropTypes.func.isRequired,
};

Header.defaultProps = {
  setResults: () => {},
};

export default Header;
