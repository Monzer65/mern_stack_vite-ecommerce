/** @format */

import { Route, Routes } from "react-router-dom";
import PropTypes from "prop-types";
import RequireAuth from "./utiles/RequireAuth";
import Home from "./pages/Home";
import Store from "./pages/product/Store";
import SearchResult from "./pages/product/SearchResult";
import ProductList from "./components/product/ProductList";
import ProductDetail from "./components/product/ProductDetail";
import Cart from "./pages/cart/Cart";
import Success from "./pages/checkout/Success";
import Cancel from "./pages/checkout/Cancel";

import RegisterForm from "./pages/auth/Register";
import Verification from "./pages/auth/Verification";
import Login from "./pages/auth/Login";
import Logout from "./pages/auth/Logout";

import Profile from "./pages/profile/Profile";
import PhoneUpdateForm from "./pages/profile/UpdatePhone";
import EmailUpdateForm from "./pages/profile/UpdateEmail";
import PhoneVerificationForm from "./pages/profile/VerifyNewPhone";
import EmailVerificationForm from "./pages/profile/VerifyNewEmail";
import PasswordUpdateForm from "./pages/profile/updatePassword";
import AddressUpdateForm from "./pages/profile/UpdateAddress";

import Dashboard from "./pages/admin-panel/Dashboard";

import NotFound from "./pages/NotFound";
import Layout from "./layout/Layout";
import Unauthorized from "./pages/Unauthorized";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* products related routes: */}
        <Route path="/home" element={<Home />} />
        <Route index element={<Store />} />
        <Route path="success" element={<Success />} />
        <Route path="cancel" element={<Cancel />} />
        <Route path="/search" element={<SearchResult />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/product/:productId" element={<ProductDetail />} />
        {/* Auth routes: */}
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/verify" element={<Verification />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />

        <Route element={<RequireAuth allowedRoles={["admin"]} />}>
          <Route path="admin" element={<Dashboard />} />
        </Route>

        <Route element={<RequireAuth allowedRoles={["user", "admin"]} />}>
          {/* profile routes: */}
          <Route path="/profile" element={<Profile />} />
          <Route
            path="/profile/update-address"
            element={<AddressUpdateForm />}
          />
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
        </Route>
        {/* page not found route: */}
        <Route path="*" element={<NotFound />} />

        <Route path="unauthorized" element={<Unauthorized />} />
      </Route>
    </Routes>
  );
}

App.propTypes = {
  setResults: PropTypes.func.isRequired,
  results: PropTypes.array.isRequired,
};

App.defaultProps = { setResults: () => {}, results: [] };

export default App;
