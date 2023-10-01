/** @format */

import { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../contexts/CartContext";
import { FaRegWindowClose } from "react-icons/fa";
import "../assets/styles/cart.css";

export default function Cart() {
  const {
    cartItems,
    addToCart,
    removeWholeItemFromCart,
    removeFromCart,
    clearCart,
    getCartTotal,
  } = useContext(CartContext);

  return (
    <div className="cart">
      <h1 className="title">سبد خرید شما:</h1>
      {cartItems.length > 0 ? (
        <div className="list">
          {cartItems.map((item) => (
            <div className="list-item" key={item._id}>
              <button
                onClick={() => {
                  removeWholeItemFromCart(item);
                }}
                className="remove-whole-item-btn"
              >
                <FaRegWindowClose />
              </button>
              <Link to={`/product/${item._id}`}>
                <div className="list-item-detail">
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    className="list-item-image"
                  />
                  <div>
                    <h3>{item.name}</h3>
                    <p>${item.price}</p>
                  </div>
                </div>
              </Link>
              <div className="list-item-buttons">
                تعداد:
                <button
                  className="cart-btn add-btn"
                  onClick={() => {
                    addToCart(item);
                  }}
                >
                  +
                </button>
                <p className="item-quantity">{item.quantity}</p>
                {item.quantity > 1 ? (
                  <button
                    className="cart-btn minus-btn"
                    onClick={() => {
                      removeFromCart(item);
                    }}
                  >
                    -
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      removeFromCart(item);
                    }}
                    className="remove-btn"
                  >
                    حذف
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <h2>خالیه!</h2>
      )}

      {cartItems.length > 0 && (
        <div className="cart-total">
          <h2>مجموع: {getCartTotal()} تومان</h2>
          <button
            className="clear-btn"
            onClick={() => {
              clearCart();
            }}
          >
            حذف همه
          </button>
          <button className="checkout-btn">پرداخت</button>
        </div>
      )}
    </div>
  );
}
