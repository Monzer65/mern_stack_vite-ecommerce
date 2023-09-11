/** @format */

import { useParams } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import { ImSpinner2 } from "react-icons/im";

function ProductDetail() {
  const { productId } = useParams();
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const apiUrl = `http://localhost:3000/api/products/${productId}`;

    axios
      .get(apiUrl)
      .then((response) => {
        setProduct(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching product details:", error);
        setLoading(false);
      });
  }, [productId]);

  const nextImage = () => {
    if (currentImageIndex < product.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    } else {
      setCurrentImageIndex(0);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    } else {
      setCurrentImageIndex(product.images.length - 1);
    }
  };

  return (
    <div className="Product-detal-container">
      {loading ? (
        <ImSpinner2 className="loading-icon-products" />
      ) : (
        <div>
          <div className="slide-container">
            <div className="slide">
              <img
                src={product.images[currentImageIndex]}
                alt={`${product.name}, image${currentImageIndex + 1}`}
              />
            </div>
            <button className="slide-button prev" onClick={prevImage}>
              {"\u276E"}
            </button>
            <button className="slide-button next" onClick={nextImage}>
              {"\u276F"}
            </button>
          </div>
          <h2>{product.name}</h2>
          <p>Price: ${product.price}</p>
          <p>{product.description}</p>
        </div>
      )}
    </div>
  );
}

export default ProductDetail;
