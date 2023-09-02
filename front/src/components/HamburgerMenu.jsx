/** @format */

// HamburgerMenu.js
import PropTypes from "prop-types";

const HamburgerMenu = ({ isOpen, toggleMenu }) => {
  return (
    <div
      className={`hamburger-menu ${isOpen ? "open" : ""}`}
      onClick={toggleMenu}
    >
      <div className="bar"></div>
      <div className="bar"></div>
      <div className="bar"></div>
    </div>
  );
};

HamburgerMenu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggleMenu: PropTypes.func.isRequired,
};

export default HamburgerMenu;
