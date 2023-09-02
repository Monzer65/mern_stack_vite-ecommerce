/** @format */

const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const reviewController = require("../controllers/reviewController");
const authMiddleware = require("../middlewares/authMiddleware");
const validationMiddleware = require("../middlewares/validationMiddleware");

router.get("/", productController.getProducts);

router.get("/featured", productController.getFeaturedProducts);

router.get("/search", productController.searchProduct);

router.get("/:productId", productController.getProductById);

router.get("/:productId/reviews", reviewController.getReviews);

router.get(
  "/:productId/averageRating",
  reviewController.getAverageRatingAndReviewCount
);

router.post(
  "/:productId/addReviews",
  authMiddleware.verifyAndRevokeAccessToken,
  validationMiddleware.validateReviewAdd,
  reviewController.addReview
);

router.delete(
  "/:reviewId/deleteReviews",
  authMiddleware.verifyAndRevokeAccessToken,
  reviewController.deleteReview
);

router.patch(
  "/:reviewId/updateReviews",
  authMiddleware.verifyAndRevokeAccessToken,
  validationMiddleware.validateReviewUpdate,
  reviewController.modifyReview
);

module.exports = router;

// const { body, param, validationResult } = require("express-validator");
// const { isAdmin } = require("../controllers/auth");
// const Fuse = require("fuse.js");

// // get 10 products on every page
// router.get("/", async (req, res) => {
//   try {
//     // Destructure the query parameters and set default values
//     const {
//       page = 1,
//       limit = 10,
//       searchTerm = "",
//       category = "",
//       make = "",
//       model = "",
//       year = "",
//     } = req.query;

//     // Define Fuse options for search
//     const fuseOptions = {
//       keys: [
//         "name",
//         "manufacturer.manufacturerName",
//         "manufacturer.brand",
//         "manufacturer.category",
//         "compatibility.make",
//         "compatibility.models",
//         "compatibility.years",
//         "tags",
//         "categories.name",
//         "categories.parent",
//         "description",
//       ],
//       includeScore: true,
//       threshold: 0.3,
//     };

//     // Create a filter object based on the category and compatibility parameters
//     const filter = {
//       $and: [
//         // Filter by category name
//         { "categories.name": { $regex: category, $options: "i" } },
//         // Filter by compatibility make
//         { "compatibility.make": { $regex: make, $options: "i" } },
//         // Filter by compatibility model
//         { "compatibility.models": { $regex: model, $options: "i" } },
//         // Filter by compatibility year
//         {
//           "compatibility.years": year ? parseInt(year) : { $exists: true },
//         }, // Parse the year parameter as a number or check if it exists
//       ],
//     };

//     // Find products from the database that match the filter criteria
//     const filteredProducts = await Product.find(filter); // Get filtered products

//     // Create a new Fuse instance with the filtered products and options
//     const fuse = new Fuse(filteredProducts, fuseOptions);

//     // Search for products using the searchTerm
//     const searchResults = searchTerm
//       ? fuse.search(searchTerm).map((result) => result.item)
//       : filteredProducts.map((product) => product.toObject()); // Convert to plain JavaScript objects

//     // Paginate the search results
//     const options = {
//       ...{ page, limit }, // Copy the page and limit variables into the options object
//       customLabels: {
//         docs: "products", // Rename the paginated documents to "products"
//         totalDocs: "totalProducts", // Rename the total document count to "totalProducts"
//       },
//     };

//     // Get the ids of the matched products
//     const searchIds = searchResults.map((product) => product._id);

//     // Use the $in operator to filter by multiple ids
//     const { products, totalProducts, totalPages } = await Product.paginate(
//       { _id: { $in: searchIds }, ...filter }, // Use the spread operator to copy the filter object into the query object
//       options
//     );

//     res.json({
//       products,
//       totalProducts,
//       totalPages,
//       currentPage: page,
//     });
//   } catch (error) {
//     res.status(500).json({ error: `${error.message}` });
//   }
// });

// // Post a new product
// router.post(
//   "/",
//   isAdmin,
//   // Validate and sanitize fields
//   body("name")
//     .trim()
//     .isLength({ min: 1 })
//     .escape()
//     .withMessage("Name must be specified."),
//   body("number")
//     .trim()
//     .isLength({ min: 1 })
//     .escape()
//     .withMessage("Number must be specified."),
//   body("manufacturer.manufacturerName")
//     .trim()
//     .isLength({ min: 1 })
//     .escape()
//     .withMessage("Manufacturer name must be specified."),
//   body("manufacturer.brand")
//     .trim()
//     .isLength({ min: 1 })
//     .escape()
//     .withMessage("Brand must be specified."),
//   body("manufacturer.category")
//     .trim()
//     .isLength({ min: 1 })
//     .escape()
//     .withMessage("Manufacturer category must be specified."),
//   body("featured")
//     .optional()
//     .isBoolean()
//     .withMessage("Featured must be a boolean value."),
//   body("homeCarousel")
//     .optional()
//     .isBoolean()
//     .withMessage("HomeCarousel must be a boolean value."),
//   body("category")
//     .trim()
//     .isLength({ min: 1 })
//     .escape()
//     .withMessage("Category must be specified."),
//   body("compatibility.make")
//     .trim()
//     .isLength({ min: 1 })
//     .escape()
//     .withMessage("Make must be specified."),
//   body("compatibility.models")
//     .optional()
//     .isArray()
//     .withMessage("Models must be an array of strings."),
//   body("compatibility.years")
//     .optional()
//     .isArray()
//     .withMessage("Years must be an array of numbers."),
//   body("images") // Change from "imageUrl" to "images"
//     .optional()
//     .isArray()
//     .withMessage("Images must be an array of strings."), // Array of image URLs
//   body("images.*")
//     .optional()
//     .isURL()
//     .withMessage("Each image must be a valid URL."), // Validate each image URL
//   body("price")
//     .isFloat({ gt: 0 })
//     .withMessage("Price must be a positive number."),
//   body("discount") // Add validation rule for discount
//     .optional()
//     .isInt({ min: 0, max: 100 })
//     .withMessage("Discount must be an integer between 0 and 100."),
//   body("quantity_in_stock")
//     .optional()
//     .isInt({ gt: -1 })
//     .withMessage("Quantity in stock must be a non-negative integer."),
//   body("dimensions.length")
//     .optional()
//     .isFloat({ gt: -1 })
//     .withMessage("Length must be a non-negative number."),
//   body("dimensions.width")
//     .optional()
//     .isFloat({ gt: -1 })
//     .withMessage("Width must be a non-negative number."),
//   body("dimensions.height")
//     .optional()
//     .isFloat({ gt: -1 })
//     .withMessage("Height must be a non-negative number."),
//   body("date_added_to_store")
//     .toDate()
//     .isISO8601()
//     .withMessage("Date added to store must be a valid ISO date."),
//   body("date_manufactured")
//     .toDate()
//     .isISO8601()
//     .withMessage("Date manufactured must be a valid ISO date."),
//   body("condition")
//     .trim()
//     .isLength({ min: 1 })
//     .escape()
//     .withMessage("Condition must be specified."),
//   body("description")
//     .trim()
//     .isLength({ min: 1 })
//     .escape()
//     .withMessage("Description must be specified."),
//   body("sku") // Add validation rule for sku
//     .trim()
//     .isLength({ min: 1 })
//     .escape()
//     .withMessage("SKU must be specified.")
//     .isAlphanumeric()
//     .withMessage("SKU must contain only letters and numbers."),
//   body("availability") // Add validation rule for availability
//     .optional()
//     .isBoolean()
//     .withMessage("Availability must be a boolean value."),
//   body("shippingWeight") // Add validation rule for shippingWeight
//     .optional()
//     .isFloat({ gt: 0 })
//     .withMessage("Shipping weight must be a positive number."),
//   body("shippingDimensions.length") // Add validation rule for shippingDimensions
//     .optional()
//     .isFloat({ gt: -1 })
//     .withMessage("Shipping length must be a non-negative number."),
//   body("shippingDimensions.width")
//     .optional()
//     .isFloat({ gt: -1 })
//     .withMessage("Shipping width must be a non-negative number."),
//   body("shippingDimensions.height")
//     .optional()
//     .isFloat({ gt: -1 })
//     .withMessage("Shipping height must be a non-negative number."),
//   body("relatedProducts") // Add validation rule for relatedProducts
//     .optional()
//     .isArray()
//     .withMessage("Related products must be an array of ObjectIds."),
//   body("averageRating") // Add validation rule for averageRating
//     .optional()
//     .isFloat({ min: 0, max: 5 })
//     .withMessage("Average rating must be a number between 0 and 5."),
//   body("options") // Add validation rule for options
//     .optional()
//     .isArray()
//     .withMessage("Options must be an array of strings."),
//   body("variations") // Add validation rule for variations
//     .optional()
//     .isArray()
//     .withMessage(
//       "Variations must be an array of objects with name and options properties."
//     ),

//   async (req, res) => {
//     // Extract the validation errors from a request
//     const errors = validationResult(req);

//     // If there are errors, send them as a response
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     // If there are no errors, proceed with creating the product
//     try {
//       const NewProduct = req.body;
//       const product = await Product.create(NewProduct);
//       res.status(201).json(product);
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   }
// );

// // Delete a product by its _id
// router.delete(
//   "/:productId",
//   isAdmin,
//   // Validate and sanitize productId param
//   param("productId").isMongoId().withMessage("Invalid product ID."),

//   async (req, res) => {
//     // Extract the validation errors from a request
//     const errors = validationResult(req);

//     // If there are errors, send them as a response
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     // If there are no errors, proceed with deleting the product
//     try {
//       const productId = req.params.productId;
//       const deletedProduct = await Product.findByIdAndDelete(productId);
//       if (deletedProduct) {
//         res.json({ message: "Product deleted successfully." });
//       } else {
//         res.status(404).json({ error: "Product not found." });
//       }
//     } catch (error) {
//       res.status(500).json({ error: "Failed to delete the product." });
//     }
//   }
// );

// // Update a product using PATCH method (applying partial modifications)
// router.patch(
//   "/:productId",
//   isAdmin,
//   // Validate and sanitize fields
//   body("name")
//     .trim()
//     .isLength({ min: 1 })
//     .escape()
//     .withMessage("Name must be specified."),
//   body("number")
//     .trim()
//     .isLength({ min: 1 })
//     .escape()
//     .withMessage("Number must be specified."),
//   body("manufacturer.manufacturerName")
//     .trim()
//     .isLength({ min: 1 })
//     .escape()
//     .withMessage("Manufacturer name must be specified."),
//   body("manufacturer.brand")
//     .trim()
//     .isLength({ min: 1 })
//     .escape()
//     .withMessage("Brand must be specified."),
//   body("manufacturer.category")
//     .trim()
//     .isLength({ min: 1 })
//     .escape()
//     .withMessage("Manufacturer category must be specified."),
//   body("featured")
//     .optional()
//     .isBoolean()
//     .withMessage("Featured must be a boolean value."),
//   body("homeCarousel")
//     .optional()
//     .isBoolean()
//     .withMessage("HomeCarousel must be a boolean value."),
//   body("category")
//     .trim()
//     .isLength({ min: 1 })
//     .escape()
//     .withMessage("Category must be specified."),
//   body("compatibility.make")
//     .trim()
//     .isLength({ min: 1 })
//     .escape()
//     .withMessage("Make must be specified."),
//   body("compatibility.models")
//     .optional()
//     .isArray()
//     .withMessage("Models must be an array of strings."),
//   body("compatibility.years")
//     .optional()
//     .isArray()
//     .withMessage("Years must be an array of numbers."),
//   body("images") // Change from "imageUrl" to "images"
//     .optional()
//     .isArray()
//     .withMessage("Images must be an array of strings."), // Array of image URLs
//   body("images.*")
//     .optional()
//     .isURL()
//     .withMessage("Each image must be a valid URL."), // Validate each image URL
//   body("price")
//     .isFloat({ gt: 0 })
//     .withMessage("Price must be a positive number."),
//   body("discount") // Add validation rule for discount
//     .optional()
//     .isInt({ min: 0, max: 100 })
//     .withMessage("Discount must be an integer between 0 and 100."),
//   body("quantity_in_stock")
//     .optional()
//     .isInt({ gt: -1 })
//     .withMessage("Quantity in stock must be a non-negative integer."),
//   body("dimensions.length")
//     .optional()
//     .isFloat({ gt: -1 })
//     .withMessage("Length must be a non-negative number."),
//   body("dimensions.width")
//     .optional()
//     .isFloat({ gt: -1 })
//     .withMessage("Width must be a non-negative number."),
//   body("dimensions.height")
//     .optional()
//     .isFloat({ gt: -1 })
//     .withMessage("Height must be a non-negative number."),
//   body("date_added_to_store")
//     .toDate()
//     .isISO8601()
//     .withMessage("Date added to store must be a valid ISO date."),
//   body("date_manufactured")
//     .toDate()
//     .isISO8601()
//     .withMessage("Date manufactured must be a valid ISO date."),
//   body("condition")
//     .trim()
//     .isLength({ min: 1 })
//     .escape()
//     .withMessage("Condition must be specified."),
//   body("description")
//     .trim()
//     .isLength({ min: 1 })
//     .escape()
//     .withMessage("Description must be specified."),
//   body("sku") // Add validation rule for sku
//     .trim()
//     .isLength({ min: 1 })
//     .escape()
//     .withMessage("SKU must be specified.")
//     .isAlphanumeric()
//     .withMessage("SKU must contain only letters and numbers."),
//   body("availability") // Add validation rule for availability
//     .optional()
//     .isBoolean()
//     .withMessage("Availability must be a boolean value."),
//   body("shippingWeight") // Add validation rule for shippingWeight
//     .optional()
//     .isFloat({ gt: 0 })
//     .withMessage("Shipping weight must be a positive number."),
//   body("shippingDimensions.length") // Add validation rule for shippingDimensions
//     .optional()
//     .isFloat({ gt: -1 })
//     .withMessage("Shipping length must be a non-negative number."),
//   body("shippingDimensions.width")
//     .optional()
//     .isFloat({ gt: -1 })
//     .withMessage("Shipping width must be a non-negative number."),
//   body("shippingDimensions.height")
//     .optional()
//     .isFloat({ gt: -1 })
//     .withMessage("Shipping height must be a non-negative number."),
//   body("relatedProducts") // Add validation rule for relatedProducts
//     .optional()
//     .isArray()
//     .withMessage("Related products must be an array of ObjectIds."),
//   body("averageRating") // Add validation rule for averageRating
//     .optional()
//     .isFloat({ min: 0, max: 5 })
//     .withMessage("Average rating must be a number between 0 and 5."),
//   body("options") // Add validation rule for options
//     .optional()
//     .isArray()
//     .withMessage("Options must be an array of strings."),
//   body("variations") // Add validation rule for variations
//     .optional()
//     .isArray()
//     .withMessage(
//       "Variations must be an array of objects with name and options properties."
//     ),

//   async (req, res) => {
//     // Extract the validation errors from a request
//     const errors = validationResult(req);

//     // If there are errors, send them as a response
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     // If there are no errors, proceed with updating the product
//     try {
//       const productId = req.params.productId;
//       const updatedProductData = req.body; // Assuming the request body contains the updated product data
//       const updatedProduct = await Product.findByIdAndUpdate(
//         productId,
//         updatedProductData,
//         { new: true }
//       );
//       if (updatedProduct) {
//         res.json(updatedProduct);
//       } else {
//         res.status(404).json({ error: "Product not found." });
//       }
//     } catch (error) {
//       res.status(500).json({ error: "Failed to update the product." });
//     }
//   }
// );

// module.exports = router;
