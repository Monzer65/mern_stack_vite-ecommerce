/** @format */

// Header.js
import Logo from "./Logo";
import SearchBox from "./SearchBox";
import Navigation from "./Navigation";
import DeliverTo from "./DeliverTo";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

function Header({ setResults, setError }) {
  const [name, setName] = useState(null);
  const accessToken = localStorage.getItem("accessToken");

  const getUserName = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/profile", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setName(response.data.profile.name);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUserName();
  }, []);

  return (
    <header className="header">
      <div className="logo-deliver-container">
        <Logo />
        <DeliverTo />
      </div>
      <SearchBox setResults={setResults} setError={setError} />
      {accessToken ? (
        // If the user has an access token, render a link to the profile route
        <div className="dropdown">
          <button className="dropbtn">
            <Link to="/profile">خوش آمدید {name}</Link>
          </button>
          <div className="dropdown-content">
            <button>
              <Link to="/logout">خروج</Link>
            </button>
          </div>
        </div>
      ) : (
        // If the user does not have an access token, render a link to the login route
        <Link to="/login">
          <div>ثبت نام/ورود</div>
        </Link>
      )}
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
