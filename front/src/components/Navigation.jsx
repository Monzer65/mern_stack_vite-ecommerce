/** @format */

import { useState } from "react";
import { Link } from "react-router-dom";
import HamburgerMenu from "./HamburgerMenu";

const Navigation = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navigation-container">
      <HamburgerMenu isOpen={menuOpen} toggleMenu={toggleMenu} />{" "}
      <ul className={`navigation ${menuOpen ? "open" : ""}`}>
        <li>
          <Link to="/" onClick={() => setMenuOpen(false)}>
            Home
          </Link>
        </li>
        <li>
          <Link to="/products" onClick={() => setMenuOpen(false)}>
            Products
          </Link>
        </li>
        <li>
          <Link to="/cart" onClick={() => setMenuOpen(false)}>
            Cart
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
