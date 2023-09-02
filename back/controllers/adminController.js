/** @format */

const User = require("../models/User");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Category = require("../models/Category");
const Review = require("../models/Review");
const Order = require("../models/Order");

module.exports = {
  async getDashboard(req, res) {
    try {
      const userId = req.user.userId;
      const role = req.user.role;
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).send("User not found");
      }

      if (role === "admin") {
        // main logic goes here
        const carts = await Cart.find().populate({
          path: "products.productId",
          select: "price",
        });

        // Calculate total revenue
        const totalRevenue = carts.reduce((total, cart) => {
          return (
            total +
            cart.products.reduce((subtotal, product) => {
              return subtotal + product.productId.price * product.quantity;
            }, 0)
          );
        }, 0);

        return res.send(`totalRevenue: ${totalRevenue}`);
      } else {
        return res.send("you don't have permission to access this route");
      }
    } catch (error) {
      console.error("Error during admin retrieval:", error);
      res.status(500).send("Server error");
    }
  },
};
