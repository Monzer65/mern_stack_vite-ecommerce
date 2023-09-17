/** @format */

import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/UseAuth";
import PropTypes from "prop-types";

const RequireAuth = ({ allowedRoles }) => {
  const { auth } = useAuth();
  const location = useLocation();

  return auth?.roles?.some((role) => allowedRoles?.includes(role)) ? (
    <Outlet />
  ) : auth?.user ? (
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
