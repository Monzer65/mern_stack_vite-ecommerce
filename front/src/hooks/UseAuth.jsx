/** @format */

import { useContext, useDebugValue } from "react";
import AuthContext from "../contexts/AuthContext";

const useAuth = () => {
  const { auth } = useContext(AuthContext);
  useDebugValue(auth, (auth) => (auth?.user ? "Logged In" : "Logged Out"));
  // console.log("auth in useAuth:", auth);
  return useContext(AuthContext);
};

export default useAuth;
