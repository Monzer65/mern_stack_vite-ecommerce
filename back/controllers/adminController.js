/** @format */

const User = require("../models/User");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Category = require("../models/Category");
const Review = require("../models/Review");
const Order = require("../models/Order");

module.exports = {
  // async getDashboard(req, res) {
  //   try {
  //     const userId = req.user.userId;
  //     const roles = req.user.roles;
  //     const user = await User.findById(userId);

  //     if (!user) {
  //       return res.status(404).send("User not found");
  //     }

  //     if (roles === "admin") {
  //       // main logic goes here
  //       const carts = await Cart.find().populate({
  //         path: "products.productId",
  //         select: "price",
  //       });

  //       // Calculate total revenue
  //       const totalRevenue = carts.reduce((total, cart) => {
  //         return (
  //           total +
  //           cart.products.reduce((subtotal, product) => {
  //             return subtotal + product.productId.price * product.quantity;
  //           }, 0)
  //         );
  //       }, 0);

  //       return res.send(`totalRevenue: ${totalRevenue}`);
  //     } else {
  //       return res.send("you don't have permission to access this route");
  //     }
  //   } catch (error) {
  //     console.error("Error during admin retrieval:", error);
  //     res.status(500).send("Server error");
  //   }
  // },

  async getUsers(req, res) {
    try {
      const userId = req.user.userId;
      const roles = req.user.roles;
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).send("User not found");
      }

      if (roles.includes("admin")) {
        const users = await User.find();

        return res.status(200).json(users);
      } else {
        return res.send("you don't have permission to access this route");
      }
    } catch (error) {
      console.error("Error during admin retrieval:", error);
      res.status(500).send("Server error");
    }
  },

  async getSingleUser(req, res) {
    try {
      const userId = req.params.id;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).send("User not found");
      }
      return res.status(200).json(user);
    } catch (error) {
      console.error("Error during user deletion:", error);
      res.status(500).send("Server error");
    }
  },

  async updateUserFields(req, res) {
    try {
      const userId = req.params.id;
      const updatedFields = req.body;
      const user = await User.findByIdAndUpdate(userId, updatedFields, {
        new: true,
      });

      if (!user) {
        return res.status(404).send("User not found");
      }

      return res.status(200).json(user);
    } catch (error) {
      console.error("Error during user update:", error);
      res.status(500).send("Server error");
    }
  },

  async deleteUser(req, res) {
    try {
      // Get the user id from the request URL
      const userId = req.params.id;

      // Find and delete the user document by id
      const user = await User.findByIdAndDelete(userId);

      // Check if the user exists
      if (!user) {
        // Send a 404 status and a message if not found
        return res.status(404).send("User not found");
      }

      const oldAccessToken = req.headers.authorization.split(" ")[1];

      if (oldAccessToken) {
        await RevokedToken.create({ token: oldAccessToken, user: user._id });
      }

      const cookies = req.cookies;
      const refreshToken = cookies.refreshToken;

      res.clearCookie("refreshToken", refreshToken, {
        domain: "localhost",
      });

      // Send a 200 status and a message if deleted successfully
      return res.status(200).json("User deleted successfully");
    } catch (error) {
      // Handle any errors and send a 500 status and a message if something goes wrong
      console.error("Error during user deletion:", error);
      res.status(500).send("Server error");
    }
  },
};
