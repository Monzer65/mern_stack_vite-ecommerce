/** @format */

import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import CategoryDropdown from "./CategoryDropdown";
import { useSearch } from "../contexts/SearchContext";
import "../assets/styles/searchbox.css";

function SearchBox() {
  const { searchTerm, setSearchTerm, selectedCategory, setSelectedCategory } =
    useSearch();
  const [inputError, setInputError] = useState("");
  const ref = useRef();
  const navigate = useNavigate();

  function handleQueryChange(event) {
    setSearchTerm(event.target.value);
    setInputError("");
  }

  function handleCategoryChange(event) {
    setSelectedCategory(event.target.value);
    setInputError("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!searchTerm && selectedCategory === "all") {
      setInputError("چیزی برای جستجو وارد نکردی");
      return;
    }

    setInputError("");

    // Construct the URL with query parameters
    const queryParams = new URLSearchParams();
    if (searchTerm) {
      queryParams.append("search", searchTerm);
    }
    if (selectedCategory !== "all") {
      queryParams.append("category", selectedCategory);
    }

    // Navigate to the /products route with the query parameters
    navigate(`/products?${queryParams.toString()}`);
  }

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (inputError && ref.current && !ref.current.contains(e.target)) {
        setInputError("");
      }
    };
    document.addEventListener("click", checkIfClickedOutside);
    return () => {
      document.removeEventListener("click", checkIfClickedOutside);
    };
  }, [inputError]);

  return (
    <div className="searchbox" ref={ref}>
      <CategoryDropdown onChange={handleCategoryChange} />
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={searchTerm}
          onChange={handleQueryChange}
          placeholder="جستجوی نام ..."
          style={{ borderColor: inputError ? "red" : "initial" }}
        />
        <button type="submit" className="submit-btn">
          <span className="sr-only">جستجو</span>
          <span>
            <FaSearch className="search-icon" />
          </span>
        </button>
      </form>
      {inputError && <p className="search-error">{inputError}</p>}
    </div>
  );
}

export default SearchBox;
