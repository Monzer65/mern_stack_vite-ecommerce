/** @format */

import logo from "../assets/logo.png";
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to="/">
      <img src={logo} className="logo react" alt="My E-Commerce" />
    </Link>
  );
};

export default Logo;
