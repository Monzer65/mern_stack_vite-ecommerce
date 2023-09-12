/** @format */

const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const reviewController = require("../controllers/reviewController");
const authMiddleware = require("../middlewares/authMiddleware");
const validationMiddleware = require("../middlewares/validationMiddleware");

router.get("/", productController.getProducts);

router.get("/conditions-and-brands", productController.getConditionsAndBrands);

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
  // authMiddleware.verifyAndRevokeAccessToken,
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
