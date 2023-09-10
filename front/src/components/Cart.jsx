/** @format */

import axios from "axios";

const Cart = () => {
  const accessToken = localStorage.getItem("accessToken");

  const {
    response: cart,
    error,
    loading,
  } = axios.get("http://localhost:3000/api/cart", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (loading) {
    return <div>Loading cart...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!cart) {
    return <div>Cart not found</div>;
  }

  return (
    <div>
      <h2>Shopping Cart</h2>
      <ul>
        {cart.products.map((item) => (
          <li key={item.productId._id}>
            {item.productId.name} - Quantity: {item.quantity}
          </li>
        ))}
      </ul>
      <p>Total Amount: ${cart.totalAmount.toFixed(2)}</p>
    </div>
  );
};

export default Cart;
