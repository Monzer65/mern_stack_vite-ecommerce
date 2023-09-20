/** @format */

import logo from "../assets/logos/mainLogo.png";
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to="/">
      <img src={logo} className="logo react" alt="Main Logo" />
    </Link>
  );
};

export default Logo;
