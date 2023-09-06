/** @format */

const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 3, // 3 requests per 5 minutes
  message: "Too many verification code requests. Please try again later.",
});

module.exports = limiter;
