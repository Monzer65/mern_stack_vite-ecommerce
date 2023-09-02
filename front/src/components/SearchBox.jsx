/** @format */

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import SearchIcon from "../assets/search_icon.png";
import CategoryDropdown from "./CategoryDropdown";

function SearchBox({ setResults, setError }) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [inputError, setInputError] = useState("");
  const navigate = useNavigate();

  function handleChange(event) {
    setQuery(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();

    let apiUrl = "http://localhost:3000/api/products/search";

    if (!query && selectedCategory === "all") {
      setInputError("No search query or category provided.");
      return;
    }

    setInputError("");

    if (query) {
      apiUrl += `?name=${query}`;

      if (selectedCategory !== "all") {
        apiUrl += `&category=${selectedCategory}`;
      }
    } else if (selectedCategory !== "all") {
      apiUrl += `?category=${selectedCategory}`;
    }

    axios
      .get(apiUrl)
      .then((response) => {
        setResults(
          Array.isArray(response.data) ? response.data : [response.data]
        );
        setError("");
        console.log(response.data);
        navigate("/search");
      })
      .catch((error) => {
        console.error(error);
        setError("Something went wrong. Please try again later.");
      });
  }

  return (
    <div className="search-component">
      <CategoryDropdown
        onChange={(event) => setSelectedCategory(event.target.value)}
      />
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="جستجوی نام ..."
          style={{ borderColor: inputError ? "red" : "initial" }}
        />
        <button type="submit">
          <span className="sr-only">جستجو</span>{" "}
          <img src={SearchIcon} className="search-icon" alt="search" />
        </button>
      </form>
      {inputError && <p className="error">{inputError}</p>}
    </div>
  );
}

SearchBox.propTypes = {
  setResults: PropTypes.func.isRequired,
  setError: PropTypes.func.isRequired,
};

SearchBox.defaultProps = {
  setResults: () => {},
};

export default SearchBox;
