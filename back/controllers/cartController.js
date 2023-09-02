/** @format */
const Cart = require("../models/Cart");

module.exports = {
  async getCart(req, res) {
    try {
      const userId = req.user._id; // Extracted from JWT middleware
      const cart = await Cart.findOne({ userId }).populate(
        "products.productId"
      );

      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }

      // Calculate the price and total amount
      let totalAmount = 0;
      cart.products.forEach((item) => {
        const product = item.productId;
        const itemPrice = product.price;
        totalAmount += itemPrice * item.quantity;

        // Adding the price to the item
        item.price = itemPrice;
      });

      cart.totalAmount = totalAmount;
      await cart.save();

      res.json(cart);
    } catch (error) {
      console.error("Error getting user cart:", error);
      res.status(500).send("Server error");
    }
  },

  async addItemToCart(req, res) {
    try {
      const userId = req.user.userId; // Extracted from JWT middleware
      const { productId, quantity } = req.body;

      // Find user's cart or create a new one if not exists
      let cart = await Cart.findOne({ userId });

      if (!cart) {
        cart = new Cart({ userId });
      }

      // Check if the product already exists in the cart
      const existingProductIndex = cart.products.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (existingProductIndex !== -1) {
        // Update quantity if product exists
        cart.products[existingProductIndex].quantity += quantity;
      } else {
        // Add the product to the cart
        cart.products.push({ productId, quantity });
      }

      await cart.save();
      res.json(cart);
    } catch (error) {
      console.error("Error adding item to cart:", error);
      res.status(500).send("Server error");
    }
  },

  async modifyQuantityInCart(req, res) {
    try {
      const userId = req.user.userId; // Extracted from JWT middleware
      const { productId, quantity } = req.body;

      const result = await Cart.update(
        { userId, "products.productId": productId },
        { $inc: { "products.$.quantity": quantity } }
      );

      if (result.nModified === 0) {
        return res.status(404).json({ error: "Product not found in cart" });
      }

      res.json({ message: "Quantity updated successfully" });
    } catch (error) {
      console.error("Error modifying quantity in cart:", error);
      res.status(500).send("Server error");
    }
  },

  async deleteCartItem(req, res) {
    try {
      const userId = req.user._id; // Extracted from JWT middleware
      const productId = req.params.productId; // Extracted from URL parameter

      const cart = await Cart.findOne({ userId });

      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }

      // Remove the item from the cart
      cart.products = cart.products.filter(
        (item) => item.productId.toString() !== productId
      );
      await cart.save();

      res.json(cart);
    } catch (error) {
      console.error("Error deleting cart item:", error);
      res.status(500).send("Server error");
    }
  },

  async clearCart(req, res) {
    try {
      const userId = req.user._id; // Extracted from JWT middleware
      const cart = await Cart.findOne({ userId });

      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }

      // Clear all items from the cart
      cart.products = [];
      await cart.save();

      res.json(cart);
    } catch (error) {
      console.error("Error clearing cart:", error);
      res.status(500).send("Server error");
    }
  },
};
