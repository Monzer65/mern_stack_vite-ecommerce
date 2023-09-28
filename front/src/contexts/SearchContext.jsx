/** @format */

import PropTypes from "prop-types";

import { createContext, useState, useContext } from "react";

const SearchContext = createContext();

export function SearchProvider({ children }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  return (
    <SearchContext.Provider
      value={{
        searchTerm,
        setSearchTerm,
        selectedCategory,
        setSelectedCategory,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

SearchProvider.propTypes = { children: PropTypes.node.isRequired };

export function useSearch() {
  return useContext(SearchContext);
}
