/** @format */

import { useContext } from "react";
import { CartContext } from "../contexts/CartContext";
import "../assets/styles/cart.css";

export default function Cart() {
  const { cartItems, addToCart, removeFromCart, clearCart, getCartTotal } =
    useContext(CartContext);

  return (
    <div className="container">
      <div className="cart">
        <h1 className="title">Cart</h1>
        {cartItems.length > 0 ? (
          <div className="list">
            {cartItems.map((item) => (
              <div className="list-item" key={item._id}>
                <img
                  src={item.images[0]}
                  alt={item.name}
                  className="list-item-image"
                />
                <div className="list-item-info">
                  <h3>{item.name}</h3>
                  <p className="text-gray-600">${item.price}</p>
                </div>
                <div className="list-item-buttons">
                  <button
                    className="cart-btn"
                    onClick={() => {
                      addToCart(item);
                    }}
                  >
                    +
                  </button>
                  <p className="item-quantity">{item.quantity}</p>
                  {item.quantity > 1 ? (
                    <button
                      className="cart-btn"
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
                    >
                      حذف
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <h2>Your cart is empty</h2>
        )}

        {cartItems.length > 0 && (
          <div className="cart-total">
            <h2>Total: ${getCartTotal()}</h2>
            <button
              className="remove-btn"
              onClick={() => {
                clearCart();
              }}
            >
              Clear cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
