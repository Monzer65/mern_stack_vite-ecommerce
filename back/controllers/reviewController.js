/** @format */

const Product = require("../models/Product");
const Review = require("../models/Review");
const { validationResult } = require("express-validator");

module.exports = {
  async getReviews(req, res) {
    try {
      const { productId } = req.params;
      const { minRating, maxRating } = req.query;

      const filter = {
        product: productId,
      };

      if (minRating && maxRating) {
        filter.rating = {
          $gte: parseInt(minRating),
          $lte: parseInt(maxRating),
        };
      }

      const reviews = await Review.find(filter)
        .populate("user", "name")
        .select("user rating title comment")
        .sort({ createdAt: -1 });

      res.json(reviews);
    } catch (error) {
      res.status(500).json({ error: "Error getting reviews" });
    }
  },

  async getAverageRatingAndReviewCount(req, res) {
    try {
      const { productId } = req.params;

      const result = await Review.aggregate([
        { $match: { product: productId } },
        {
          $group: {
            _id: "$product",
            averageRating: { $avg: "$rating" },
            reviewCount: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            product: "$_id",
            averageRating: 1,
            reviewCount: 1,
          },
        },
      ]);

      res.json(result);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error getting average rating and review count" });
    }
  },

  async addReview(req, res) {
    try {
      const { rating, title, comment } = req.body;
      const { productId } = req.params;
      const user = req.user; // This should be the user info from JWT extraction
      const product = await Product.findById(productId);
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      const existingReview = await Review.findOne({
        user: user.userId,
        product: productId,
      });

      if (existingReview) {
        return res.status(400).json({
          error: "User has already submitted a review for this product",
        });
      }

      const newReview = new Review({
        user: user.userId,
        product: productId,
        rating,
        title,
        comment,
      });

      const savedReview = await newReview.save();

      res.status(201).json(savedReview);
    } catch (error) {
      res.status(500).json({ error: "Error creating review" });
    }
  },

  async deleteReview(req, res) {
    try {
      const { reviewId } = req.params;
      const user = req.user; // This should be the user info from JWT extraction

      const review = await Review.findById(reviewId);

      if (!review) {
        return res.status(404).json({ error: "Review not found" });
      }

      // Check if the user is the owner of the review or an administrator
      if (
        user.role === "admin" ||
        review.user.toString() === user.userId.toString()
      ) {
        await review.deleteOne({ _id: reviewId });
        res.status(204).send();
      } else {
        return res
          .status(403)
          .json({ error: "Unauthorized to delete this review" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error deleting review" });
    }
  },

  async modifyReview(req, res) {
    try {
      const { reviewId } = req.params;
      const user = req.user; // This should be the user info from JWT extraction

      const review = await Review.findById(reviewId);

      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      if (!review) {
        return res.status(404).json({ error: "Review not found" });
      }

      // Check if the user is the owner of the review
      if (review.user.toString() === user.userId.toString()) {
        const { rating, title, comment } = req.body;

        if (rating !== undefined) {
          review.rating = rating;
        }
        if (title !== undefined) {
          review.title = title;
        }
        if (comment !== undefined) {
          review.comment = comment;
        }
        await review.save();

        res.json(review);
      } else {
        return res
          .status(403)
          .json({ error: "Unauthorized to modify this review" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error modifying review" });
    }
  },
};
