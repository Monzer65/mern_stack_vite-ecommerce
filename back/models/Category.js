/** @format */

const mongoose = require("mongoose");

// const categorySchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     unique: true,
//     lowercase: true,
//     trim: true, // Remove any leading or trailing whitespace
//   },
//   parentCategory: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Category",
//   },
//   description: {
//     type: String,
//     default: "", // Set a default value for the description
//   },
//   image: {
//     type: String,
//     default: "", // Set a default value for the image URL
//   },
//   slug: {
//     type: String,
//     unique: true,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now, // Set a default value for the creation date
//   },
// });

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    image: String,
    featured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// categorySchema.pre("save", function (next) {
//   this.slug = this.name.toLowerCase().replace(/\s+/g, "-"); // Replace spaces with hyphens
//   next();
// });

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
