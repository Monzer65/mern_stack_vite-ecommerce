/** @format */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../assets/styles/slide.css";

const Slide = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [categories, setCategories] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCategories() {
      const { data: categories } = await axios.get(
        "http://localhost:3000/api/categories/featured"
      );
      setCategories(categories);
    }
    fetchCategories();
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? categories.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === categories.length - 1 ? 0 : prevIndex + 1
    );
  };

  if (!categories || categories.length === 0) {
    return (
      <div className="slide-container">No featured categories available.</div>
    );
  }

  const currentcategory = categories[currentIndex];

  const selectedCategoryId = currentcategory._id;

  // Wrap navigate in a callback function
  const navigateToCategory = () => {
    navigate(
      `/products?page=1&limit=20&search=&sort=&category=${selectedCategoryId}`
    );
  };

  return (
    <div className="slide-container">
      {/* Attach the onClick event to the callback function */}
      <div className="slide" onClick={navigateToCategory}>
        <img src={currentcategory?.image} alt={currentcategory?.name} />
        <h3>{currentcategory.name}</h3>
      </div>
      <button className="slide-button prev" onClick={handlePrev}>
        {"\u276E"}
      </button>
      <button className="slide-button next" onClick={handleNext}>
        {"\u276F"}
      </button>
    </div>
  );
};

export default Slide;
