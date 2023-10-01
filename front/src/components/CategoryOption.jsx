/** @format */

import { useState } from "react";
import PropTypes from "prop-types";
import "../assets/styles/CategoryOption.css";
import { FaAngleRight, FaAngleDown } from "react-icons/fa";

function CategoryOption({ category, onSelectCategory }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleCategory = () => {
    setIsOpen(!isOpen);
  };

  return (
    <li className="category-option ">
      <div className="category-header">
        <span
          className="category-name "
          onClick={() => {
            onSelectCategory(category._id);
          }}
        >
          {category.name}
        </span>
        {category.children && (
          <button className="category-toggle" onClick={toggleCategory}>
            {isOpen ? <FaAngleDown /> : <FaAngleRight />}
          </button>
        )}
      </div>
      {isOpen && category.children && (
        <li className="sub-categories">
          {category.children.map((childCategory) => (
            <CategoryOption
              category={childCategory}
              key={childCategory._id}
              onSelectCategory={onSelectCategory}
            />
          ))}
        </li>
      )}
    </li>
  );
}

CategoryOption.propTypes = {
  category: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    children: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  onSelectCategory: PropTypes.func.isRequired,
};

export default CategoryOption;
