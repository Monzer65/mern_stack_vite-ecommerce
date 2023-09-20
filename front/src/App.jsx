/** @format */

import { Route, Routes } from "react-router-dom";
import PropTypes from "prop-types";
import RequireAuth from "./components/RequireAuth";
import Home from "./pages/Home";
import Store from "./pages/Store";
import SearchResult from "./pages/SearchResult";
import ProductList from "./components/ProductList";
import ProductDetail from "./components/ProductDetail";
import Cart from "./pages/Cart";
import Success from "./pages/OrderSuccess";
import Cancel from "./pages/OrderCancel";

import RegisterForm from "./pages/Register";
import Verification from "./pages/Verification";
import Login from "./pages/Login";
// import Logout from "./pages/auth/Logout";

import Profile from "./pages/Profile";
import PhoneUpdateForm from "./pages/UpdatePhone";
import EmailUpdateForm from "./pages/UpdateEmail";
import PhoneVerificationForm from "./pages/VerifyNewPhone";
import EmailVerificationForm from "./pages/VerifyNewEmail";
import PasswordUpdateForm from "./pages/updatePassword";
import AddressUpdateForm from "./pages/UpdateAddress";

import Dashboard from "./pages/AdminDashBoard";

import NotFound from "./pages/NotFound";
import Layout from "./layout/Layout";
import Unauthorized from "./pages/Unauthorized";
import PersistLogin from "./components/PersistLogin";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* products related routes: */}
        <Route path="/home" element={<Home />} />
        <Route index element={<Store />} />
        <Route path="/success" element={<Success />} />
        <Route path="/cancel" element={<Cancel />} />
        <Route path="/search" element={<SearchResult />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/product/:productId" element={<ProductDetail />} />
        {/* Auth routes: */}
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/verify" element={<Verification />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/logout" element={<Logout />} /> */}

        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth allowedRoles={["admin"]} />}>
            <Route path="/admin" element={<Dashboard />} />
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
        </Route>
        {/* page not found route: */}
        <Route path="*" element={<NotFound />} />

        <Route path="/unauthorized" element={<Unauthorized />} />
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
