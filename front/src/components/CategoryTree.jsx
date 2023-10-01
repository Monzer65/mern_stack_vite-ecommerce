/** @format */
import { useEffect, useState } from "react";
import axios from "axios";
import { FaAngleRight, FaAngleDown } from "react-icons/fa";
import CategoryOption from "./CategoryOption";
const CategoryTree = () => {
  const [categories, setCategories] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/api/categories");
      const nestedCategories = buildCategoryTree(data);
      setCategories(nestedCategories);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  function buildCategoryTree(categories, parentId = null) {
    const categoryTree = [];
    for (const category of categories) {
      if (category.parent === parentId) {
        const children = buildCategoryTree(categories, category._id);
        if (children.length) {
          category.children = children;
        }
        categoryTree.push(category);
      }
    }
    return categoryTree;
  }

  const majorParentCategories = categories.filter(
    (category) => category.parent === null
  );

  const toggleCategory = () => {
    setIsOpen(!isOpen);
  };

  return (
    <ul className="category-drop-down">
      <li className="all-categories-option">
        <button>All Categories</button>
        <button className="category-toggle" onClick={toggleCategory}>
          {isOpen ? <FaAngleDown /> : <FaAngleRight />}
        </button>
      </li>
      <li className="major-categories-option">
        {isOpen &&
          majorParentCategories?.map((category) => (
            <CategoryOption category={category} key={category._id} />
          ))}
      </li>
    </ul>
  );
};

export default CategoryTree;
