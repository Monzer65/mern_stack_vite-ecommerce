/** @format */

import { useContext, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { CartContext } from "../contexts/CartContext";

function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);
  const [showNotification, setShowNotification] = useState(false);

  const handleAddToCart = () => {
    addToCart(product);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 2500);
  };

  return (
    <>
      <div className="product-card">
        <Link to={`/product/${product._id}`}>
          <div className="image-container">
            <img src={product.images[0]} alt={product.name} />
          </div>
          <div>
            <div className="product-info-container">
              <h3>{product.name}</h3>
              <h2>{product.price}</h2>
            </div>
          </div>
        </Link>
        <button onClick={handleAddToCart}>Add to cart</button>
        {showNotification && (
          <div className="notification">
            Product added to cart <span className="tick">✓</span>
          </div>
        )}
      </div>
    </>
  );
}

ProductCard.propTypes = {
  product: PropTypes.shape({
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    images: PropTypes.arrayOf(PropTypes.string).isRequired,
    _id: PropTypes.string.isRequired,
  }).isRequired,
};

export default ProductCard;
