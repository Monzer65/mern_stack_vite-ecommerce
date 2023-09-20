/** @format */

import { useState } from "react";
import axios from "axios";

const Slide = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const {
    data: categories,
    loading,
    error,
  } = axios("http://localhost:3000/api/categories/featured", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

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

  if (loading) {
    return <div>Loading…</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="slide-container">No featured categories available.</div>
    );
  }

  const currentcategory = categories[currentIndex];
  return (
    <div className="slide-container">
      <div className="slide">
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
