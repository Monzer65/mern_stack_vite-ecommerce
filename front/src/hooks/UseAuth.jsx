/** @format */

import { useContext, useDebugValue } from "react";
import AuthContext from "../contexts/AuthContext";

const useAuth = () => {
  const { auth } = useContext(AuthContext);
  useDebugValue(auth, (auth) => (auth?.contact ? "Logged In" : "Logged Out"));
  return useContext(AuthContext);
};

export default useAuth;
