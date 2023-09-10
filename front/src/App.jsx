/** @format */

import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import SearchResult from "./components/SearchResult";
import PropTypes from "prop-types";
import Home from "./components/Home";
import Cart from "./components/Cart";
import RegisterForm from "./components/Register";
import Verification from "./components/Verification";
import Login from "./components/Login";
import Logout from "./components/Logout";
import Profile from "./components/Profile";

import NotFound from "./components/NotFound";
import PhoneUpdateForm from "./components/UpdatePhone";
import PasswordUpdateForm from "./components/updatePassword";
import EmailUpdateForm from "./components/UpdateEmail";
import PhoneVerificationForm from "./components/VerifyNewPhone";
import EmailVerificationForm from "./components/VerifyNewEmail";
import AddressUpdateForm from "./components/UpdateAddress";
import ProductList from "./components/ProductList";

function App() {
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  return (
    <Router>
      {" "}
      <Header setResults={setResults} setError={setError} />
      <Routes>
        {/* products related routes: */}
        <Route path="/" element={<Home />} />
        <Route
          path="/search"
          element={<SearchResult results={results} error={error} />}
        />
        <Route path="/cart" element={<Cart />} />
        <Route path="/products" element={<ProductList />} />

        {/* Auth routes: */}
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/verify" element={<Verification />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />

        {/* profile routes: */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/update-address" element={<AddressUpdateForm />} />
        <Route
          path="/profile/update-password"
          element={<PasswordUpdateForm />}
        />
        <Route path="/profile/update-email" element={<EmailUpdateForm />} />
        <Route
          path="/profile/update-email/verify-new-email"
          element={<EmailVerificationForm />}
        />
        <Route path="/profile/update-phone" element={<PhoneUpdateForm />} />
        <Route
          path="/profile/update-phone/verify-new-phone"
          element={<PhoneVerificationForm />}
        />
        {/* page not found route: */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

App.propTypes = {
  setResults: PropTypes.func.isRequired,
  results: PropTypes.array.isRequired,
};

App.defaultProps = { setResults: () => {}, results: [] };

export default App;
