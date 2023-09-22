/** @format */

// UserContext.js
import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";

const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [userName, setUserName] = useState("");

  const setUserProfile = (name) => {
    setUserName(name);
  };

  return (
    <UserContext.Provider value={{ userName, setUserProfile }}>
      {children}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
