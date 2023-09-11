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
const getDescendants = async (category) => {
  // Initialize an empty array to store the results
  let descendants = [];

  // Use a recursive function to find all the children and grandchildren of the category
  const findChildren = async (parent) => {
    // Find all the categories that have the parent as their parent field
    const children = await Category.find({ parent: parent });

    // If there are any children, add them to the descendants array and call the function again for each child
    if (children.length > 0) {
      descendants.push(...children);
      for (let child of children) {
        await findChildren(child._id);
      }
    }
  };

  // Call the recursive function with the given category as the initial parent
  await findChildren(category);

  // Return the descendants array
  return descendants;
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
      const { category, conditions, brands, search, sort, page } = req.query;
      const perPage = 20;
      const skip = (page - 1) * perPage;

      // Build the filter object based on query parameters
      const filter = {};
      if (category) {
        const descendantCategories = await getDescendants(category);
        filter.category = { $in: [...descendantCategories, category] };
      }
      if (conditions) {
        filter.condition = {
          $in: Array.isArray(conditions) ? conditions : [conditions],
        };
      }
      if (brands) {
        filter["manufacturer.brand"] = {
          $in: Array.isArray(brands) ? brands : [brands],
        };
      }

      if (search) {
        // Use $regex to perform a case-insensitive search
        filter.$or = [
          { name: { $regex: search, $options: "i" } }, // Search in product name
          { description: { $regex: search, $options: "i" } }, // Search in product description
          { tags: { $in: [search] } }, // Search in tags
          // Add more fields if needed
        ];
      }

      const count = await Product.countDocuments(filter);

      // Build the sort options based on query parameters
      const sortOptions = {};
      if (sort === "priceLowToHigh") {
        sortOptions.price = 1;
      } else if (sort === "priceHighToLow") {
        sortOptions.price = -1;
      } else if (sort === "newestFirst") {
        sortOptions.date_added_to_store = -1;
      } else if (sort === "featuredFirst") {
        sortOptions.featured = -1;
      }

      const products = await Product.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(perPage);

      res.json(products, count);
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
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

  async getConditionsAndBrands(req, res) {
    try {
      const conditions = await Product.distinct("condition");
      const brands = await Product.distinct("manufacturer.brand");

      res.json({ conditions, brands });
    } catch (err) {
      console.error(err);
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
