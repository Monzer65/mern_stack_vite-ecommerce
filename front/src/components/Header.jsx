/** @format */

// Header.js
import Logo from "./Logo";
import SearchBox from "./SearchBox";
import Navigation from "./Navigation";
import DeliverTo from "./DeliverTo";
import PropTypes from "prop-types";

function Header({ setResults, setError }) {
  return (
    <header className="header">
      <div className="logo-deliver-container">
        <Logo />
        <DeliverTo />
      </div>
      <SearchBox setResults={setResults} setError={setError} />

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
