/** @format */

import { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";

function NestedCategoryMenu({ onChange }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch nested categories from your API
    axios
      .get("http://localhost:3000/api/categories?nested=true")
      .then((response) => {
        setCategories(response.data);
      });
  }, []);

  const renderCategories = (categoryList) => {
    if (!categoryList || categoryList.length === 0) {
      return null;
    }
    return (
      <ul>
        {categoryList.map((category) => (
          <li key={category._id}>
            <label>
              <input
                type="radio"
                name="selectedCategory"
                value={category._id}
                onChange={() => onChange(category._id)}
              />
              {category.name}
            </label>
            {category.children.length > 0 &&
              renderCategories(category.children)}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="nested-category-menu">
      <h3>Select a Category:</h3>
      {renderCategories(categories)}
    </div>
  );
}

NestedCategoryMenu.propTypes = {
  onChange: PropTypes.func.isRequired,
};
export default NestedCategoryMenu;
