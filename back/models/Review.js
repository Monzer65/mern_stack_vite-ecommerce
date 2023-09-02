/** @format */

const mongoose = require("mongoose");
const User = require("../models/User");
const Product = require("../models/Product");

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      validate: {
        validator: async function (value) {
          // Check if the user ID exists in the User collection
          const user = await User.findById(value);
          return !!user;
        },
        message: "User not found",
      },
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      validate: {
        validator: async function (value) {
          // Check if the product ID exists in the Product collection
          const product = await Product.findById(value);
          return !!product;
        },
        message: "Product not found",
      },
    },
    rating: { type: Number, required: true },
    title: { type: String, required: true },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
