/** @format */

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../contexts/SearchContext";
import { FaSearch } from "react-icons/fa";
import CategoryDropdown from "./CategoryDropdown";
import "../assets/styles/searchbox.css";

function SearchBox() {
  const { setSearchTerm, setSelectedCategory } = useSearch();
  const [localSearchTerm, setLocalSearchTerm] = useState("");
  const [localSelectedCategory, setLocalSelectedCategory] = useState("");

  const [inputError, setInputError] = useState("");
  const ref = useRef();
  const navigate = useNavigate();

  function handleSearchTermChange(event) {
    setLocalSearchTerm(event.target.value);
    setInputError("");
  }

  function handleCategoryChange(event) {
    setLocalSelectedCategory(event.target.value);
    setInputError("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!localSearchTerm && localSelectedCategory === "all") {
      setSelectedCategory("");
      setLocalSelectedCategory("");
      setInputError("چیزی برای جستجو وارد نکردی");
      return;
    }

    setInputError("");

    setSearchTerm(localSearchTerm);
    setSelectedCategory(localSelectedCategory);
    // Construct the URL with query parameters
    const queryParams = new URLSearchParams();
    if (localSearchTerm) {
      queryParams.append("searchTerm", localSearchTerm);
    }
    if (localSelectedCategory !== "all") {
      queryParams.append("category", localSelectedCategory);
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
          value={localSearchTerm}
          onChange={handleSearchTermChange}
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
