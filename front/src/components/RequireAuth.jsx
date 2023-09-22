/** @format */

import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/UseAuth";
import PropTypes from "prop-types";
import jwt_decode from "jwt-decode";

const RequireAuth = ({ allowedRoles }) => {
  const { auth } = useAuth();
  const location = useLocation();
  const decoded = auth?.accessToken ? jwt_decode(auth.accessToken) : undefined;
  const roles = decoded?.roles || [];

  return roles.find((role) => allowedRoles?.includes(role)) ? (
    <Outlet />
  ) : auth?.contact ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

RequireAuth.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
};

RequireAuth.defaultProps = {
  allowedRoles: [],
};

export default RequireAuth;
