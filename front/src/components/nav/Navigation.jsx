/** @format */

import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import HamburgerMenu from "./HamburgerMenu";
import { CartContext } from "../../contexts/CartContext";

const Navigation = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const { cartItems } = useContext(CartContext);

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
          <Link
            to={{
              pathname: "/profile",
              state: { from: location.pathname },
            }}
            onClick={() => setMenuOpen(false)}
          >
            Profile
          </Link>
        </li>
        <li>
          <Link to="/cart" onClick={() => setMenuOpen(false)}>
            Cart <span>{cartItems.length}</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
