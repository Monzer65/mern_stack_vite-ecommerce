/** @format */

const mongoose = require("mongoose");

const productsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    images: [{ type: String }],
    number: {
      type: String,
      required: true,
    },
    manufacturer: {
      manufacturerName: {
        type: String,
        required: true,
      },
      brand: {
        type: String,
        required: true,
      },
    },
    // Array of category objects
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    featured: {
      type: Boolean,
      default: false,
    },
    homeCarousel: {
      type: Boolean,
      default: false,
    },
    compatibility: {
      make: {
        type: String,
        required: true,
      },
      models: [String],
      years: [Number],
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: { type: Number, min: 0, max: 100 },
    quantity_in_stock: {
      type: Number,
      min: 0,
    },
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
      min: [0, 0, 0],
    },
    date_added_to_store: {
      type: Date,
      required: true,
    },
    date_manufactured: {
      type: Date,
      required: true,
    },
    condition: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    tags: [{ type: String, required: true }],
    sku: { type: String, required: true }, // Stock Keeping Unit
    availability: { type: Boolean, default: true }, // Product Availability
    shippingWeight: { type: Number }, // Product weight for shipping
    shippingDimensions: {
      length: Number,
      width: Number,
      height: Number,
    },
    relatedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }], // IDs of related products
    // averageRating: { type: Number, min: 0, max: 5 }, // Average rating based on all reviews
    options: [{ type: String }], // Product options (e.g., color, size)
    variations: [
      {
        // Variations for customizable products
        name: { type: String, required: true },
        options: [{ type: String, required: true }],
      },
    ],
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productsSchema);

module.exports = Product;
