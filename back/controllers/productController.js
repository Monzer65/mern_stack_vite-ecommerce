/** @format */

const Product = require("../models/Product");
const Category = require("../models/Category");
const { validationResult } = require("express-validator");

const LOW_STOCK_THRESHOLD = 10;
const REORDER_THRESHOLD = 15;

// const checkAdminRole = async (req, res) => {
//   const userId = req.user.userId;
//   const user = await User.findById(userId);

//   if (!user) {
//     return res.status(404).send("User not found");
//   }

//   const role = req.user.role;

//   if (role !== "admin") {
//     return res.status(403).send("Access denied");
//   }
// };

// A helper function that takes a parent category id as an input and returns an array of all the descendant category ids, including the parent itself
const getDescendantCategories = async (parentCategoryId) => {
  let descendantCategoryIds = [];

  // If parentCategoryId is null or undefined, return an empty array
  if (!parentCategoryId) {
    return descendantCategoryIds;
  }

  descendantCategoryIds.push(parentCategoryId);

  // Find all the direct subcategories of the parentCategoryId using Mongoose
  const subcategories = await Category.find({ parent: parentCategoryId });

  // Loop through each subcategory and call this function recursively
  for (let subcategory of subcategories) {
    // Get all the descendant categories of this subcategory
    const subDescendantCategories = await getDescendantCategories(
      subcategory._id
    );

    // Push them to the descendantCategoryIds array
    descendantCategoryIds.push(...subDescendantCategories);
  }

  return descendantCategoryIds;
};

module.exports = {
  async getAdminProducts(req, res) {
    try {
      // await checkAdminRole(req, res);

      const products = await Product.find();
      const productsWithStockInfo = products.map((product) => ({
        ...product.toObject(),
        stock: product.quantity_in_stock,
        available: product.availability && product.quantity_in_stock > 0,
      }));

      return res.send(productsWithStockInfo);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Server error");
    }
  },

  async getProducts(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const search = req.query.search || "";
      const sort = req.query.sort || "date_added_to_store";

      // Initialize the filter object
      let filter = {
        name: { $regex: search, $options: "i" },
      };

      // Add filters for category, featured, make, model year range, and condition
      if (req.query.category) {
        filter.category = req.query.category;
      }

      if (req.query.featured) {
        filter.featured = req.query.featured === "true"; // Convert to boolean
      }

      if (req.query.make) {
        filter["compatibility.make"] = req.query.make;
      }

      if (req.query.models) {
        filter["compatibility.models"] = { $in: req.query.models.split(",") };
      }

      if (req.query.minYear && req.query.maxYear) {
        filter["compatibility.years"] = {
          $gte: parseInt(req.query.minYear),
          $lte: parseInt(req.query.maxYear),
        };
      }

      if (req.query.condition) {
        filter.condition = req.query.condition;
      }

      const products = await Product.find(filter)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit);

      const totalProducts = await Product.countDocuments(filter);

      const totalPages = Math.ceil(totalProducts / limit);
      const currentPage = page;

      const response = {
        error: false,
        count: totalProducts,
        page: currentPage,
        limit: limit,
        products: products,
      };

      res.status(200).json(response);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: true, message: "Server error" });
    }
  },

  async getProductById(req, res) {
    try {
      const productId = req.params.productId;

      const product = await Product.findById(productId).select(
        "name images manufacturer price description"
      );

      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.json(product);
    } catch (error) {
      console.error("Error during product retrieval:", error);
      res.status(500).send("Server error");
    }
  },

  async getFeaturedProducts(req, res) {
    try {
      const featuredProducts = await Product.find({ featured: true })
        .sort({ date_added_to_store: -1 })
        .limit(3)
        .select("name _id images")
        .lean();

      res.json(featuredProducts);
    } catch (error) {
      console.error("Error during featured product retrieval:", error);
      res.status(500).send("Server error");
    }
  },

  async getLowStockProducts(req, res) {
    try {
      // await checkAdminRole(req, res);

      const products = await Product.find({
        quantity_in_stock: { $lte: LOW_STOCK_THRESHOLD },
      });

      return res.send(products);
    } catch (error) {
      console.error("Error during low stock retrieval:", error);
      res.status(500).send("Server error");
    }
  },

  async getReorderSuggestions(req, res) {
    try {
      // await checkAdminRole(req, res);

      const products = await Product.find({
        quantity_in_stock: { $lte: REORDER_THRESHOLD },
      });

      return res.send(products);
    } catch (error) {
      console.error("Error during reorder suggestions retrieval:", error);
      res.status(500).send("Server error");
    }
  },

  async searchProduct(req, res) {
    const name = req.query.name;
    const category = req.query.category;

    // Check if both name and category are empty
    if (!name && !category) {
      return res
        .status(400)
        .json({ error: "No search query or category provided." });
    }

    let filter = {};

    if (name) {
      filter.name = { $regex: name, $options: "i" }; // Case-insensitive match
    }

    // If category is provided, add an array condition to the filter object
    if (category) {
      // Get all the descendant categories of this category using your helper function
      const descendantCategories = await getDescendantCategories(category);

      // Add them to your filter object using $in operator
      filter.category = { $in: descendantCategories };
    }

    try {
      const products = await Product.find(filter);
      res.json(products);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  },

  async createProduct(req, res) {
    try {
      // await checkAdminRole(req, res);

      const newProductData = req.body;

      const newProduct = await Product.create(newProductData);
    } catch (error) {
      console.error("Error during product creation:", error);
      res.status(500).send("Server error");
    }
  },

  async updateProduct(req, res) {
    try {
      // await checkAdminRole(req, res);

      const productId = req.params.productId;
      const updatedProductData = req.body;

      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        updatedProductData,
        {
          new: true,
        }
      );

      if (!updatedProduct) {
        return res.status(404).send("Product not found");
      }
    } catch (error) {
      console.error("Error during product update:", error);
      res.status(500).send("Server error");
    }
  },

  async deleteProduct(req, res) {
    try {
      // await checkAdminRole(req, res);

      const productId = req.params.productId;

      const deletedProduct = await Product.findByIdAndRemove(productId);

      if (!deletedProduct) {
        return res.status(404).send("Product not found");
      }

      return res.send("Product deleted successfully");
    } catch (error) {
      console.error("Error during product deletion:", error);
      res.status(500).send("Server error");
    }
  },
};
