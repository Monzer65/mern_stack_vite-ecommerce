/** @format */

import { useContext, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { CartContext } from "../../contexts/CartContext";

function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);
  const [showNotification, setShowNotification] = useState(false); // State for notification

  const handleAddToCart = () => {
    addToCart(product);
    setShowNotification(true); // Show notification on successful add
    // You can also hide the notification after a certain time if needed
    setTimeout(() => {
      setShowNotification(false);
    }, 3000); // Hide notification after 3 seconds (adjust as needed)
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
    price: PropTypes.string.isRequired,
    images: PropTypes.arrayOf(PropTypes.string).isRequired,
    _id: PropTypes.string.isRequired,
  }).isRequired,
};

export default ProductCard;
