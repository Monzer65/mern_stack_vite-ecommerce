/** @format */

const Order = require("../models/Order");
const Cart = require("../models/Cart");
const User = require("../models/User");

function getUserAddress(user) {
  const addressFields = [
    "apartment",
    "street",
    "city",
    "province",
    "postalCode",
    "postalPhone",
  ];
  const addressValues = addressFields
    .map((field) => user[field])
    .filter(Boolean);
  return addressValues.join(", ");
}

function calculateTotalAmount(products) {
  return products.reduce(
    (total, product) => total + product.productId.price * product.quantity,
    0
  );
}

module.exports = {
  async getRecentOrders(req, res) {
    try {
      const user = req.user; // Extracted from JWT middleware

      if (user.roles !== "admin") {
        return res.status(403).json({ message: "Access denied" });
      }

      const orders = await Order.find()
        .sort({ createdAt: -1 })
        .limit(10) // Get recent 10 orders
        .populate("userId", "name"); // Populate customer info

      const ordersWithCustomerNames = orders.map((order) => ({
        orderId: order.userId,
        customerName: order.userId.name,
        status: order.status,
      }));

      res.json(ordersWithCustomerNames);
    } catch (error) {
      console.error("Error getting recent orders:", error);
      res.status(500).send("Server error");
    }
  },

  async getOrdersWithPagination(req, res) {
    try {
      const user = req.user; // Extracted from JWT middleware

      if (user.role !== "admin") {
        return res.status(403).json({ message: "Access denied" });
      }

      const page = parseInt(req.query.page) || 1; // Get page number from query parameter, default to 1
      const pageSize = 10; // Number of orders per page

      const totalOrders = await Order.countDocuments(); // Get total number of orders

      const totalPages = Math.ceil(totalOrders / pageSize); // Calculate total number of pages

      if (page > totalPages) {
        return res.status(404).json({ message: "Page not found" });
      }

      const orders = await Order.find()
        .sort({ createdAt: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .populate("userId", "name"); // Populate customer info

      const ordersWithCustomerNames = orders.map((order) => ({
        orderId: order.userId,
        customerName: order.userId.name,
        status: order.status,
      }));

      res.json({
        orders: ordersWithCustomerNames,
        currentPage: page,
        totalPages,
      });
    } catch (error) {
      console.error("Error getting orders with pagination:", error);
      res.status(500).send("Server error");
    }
  },

  async createOrder(req, res) {
    try {
      const user = req.user;
      const { cartId, paymentMethod } = req.body;

      const cart = await Cart.findById(cartId).populate("products.productId");

      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }

      if (cart.userId.toString() !== user._id.toString()) {
        return res.status(403).json({ message: "Access denied" });
      }

      if (cart.products.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
      }

      // Fetch the user to get the address details
      const userWithAddress = await User.findById(user._id);

      if (!userWithAddress) {
        return res.status(404).json({ message: "User not found" });
      }

      // Use the user address as the shipping address for the order
      const userAddress = getUserAddress(userWithAddress);

      if (!userAddress) {
        return res.status(400).json({ message: "User address is empty" });
      }

      const order = new Order({
        userId: user._id,
        products: cart.products.map((item) => ({
          productId: item.productId._id,
          price: item.productId.price,
          quantity: item.quantity,
        })),
        totalAmount: calculateTotalAmount(cart.products),
        shippingAddress: userAddress,
        paymentMethod,
        status: "processing",
      });

      await order.save();
      await cart.clear();

      res.json(order);
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).send("Server error");
    }
  },

  async filterAndSearchOrders(req, res) {
    try {
      const user = req.user; // Extracted from JWT middleware

      if (user.role !== "admin") {
        return res.status(403).json({ message: "Access denied" });
      }

      const { status, customerName } = req.query;
      const query = {};

      if (status) {
        query.status = status;
      }

      if (customerName) {
        query["userId.name"] = { $regex: customerName, $options: "i" };
      }

      const orders = await Order.find(query).populate("userId", "name");

      const ordersWithCustomerNames = orders.map((order) => ({
        orderId: order.userId,
        customerName: order.userId.name,
        status: order.status,
      }));

      res.json(ordersWithCustomerNames);
    } catch (error) {
      console.error("Error filtering and searching orders:", error);
      res.status(500).send("Server error");
    }
  },

  async changeOrderStatus(req, res) {
    try {
      const user = req.user; // Extracted from JWT middleware

      if (user.role !== "admin") {
        return res.status(403).json({ message: "Access denied" });
      }

      const orderId = req.params.orderId;
      const { newStatus } = req.body;

      const order = await Order.findById(orderId);

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      if (
        !["processing", "shipped", "delivered", "canceled"].includes(newStatus)
      ) {
        return res.status(400).json({ message: "Invalid status" });
      }

      order.status = newStatus;
      await order.save();

      res.json(order);
    } catch (error) {
      console.error("Error changing order status:", error);
      res.status(500).send("Server error");
    }
  },
};
