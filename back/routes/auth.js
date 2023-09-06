/** @format */

const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");
const validationMiddleware = require("../middlewares/validationMiddleware");
const limiter = require("../config/rateLimitConfig");
const cron = require("node-cron");

cron.schedule("*/30 * * * *", async () => {
  const expirationThreshold = Date.now() - 15 * 60 * 1000; // 15 minutes in milliseconds
  try {
    // Find and remove unverified users with expired verification codes
    await User.deleteMany({
      $and: [
        { verificationCodeExpiration: { $lt: expirationThreshold } },
        { isVerified: false },
      ],
    });

    // Remove specific fields from verified users with expired verification codes
    await User.updateMany(
      {
        $and: [
          { verificationCodeExpiration: { $lt: expirationThreshold } },
          { isVerified: true },
        ],
      },
      {
        $unset: {
          verificationCode: 1,
          verificationCodeExpiration: 1,
          isVerificationOngoing: 1,
          newEmail: 1,
          newPhone: 1,
        },
      }
    );

    console.log("Expired and unverified users removed.");
    console.log("Expired and unverified users' fields removed.");
  } catch (err) {
    console.error("Error while removing users or fields:", err);
  }
});

router.post(
  "/register",
  validationMiddleware.validateRegistration,
  authController.registerUser
);

router.post("/verify", authController.verifyUser);

router.post("/resend", limiter, authController.resendCode);

router.post(
  "/login",
  validationMiddleware.validateLogin,
  authController.loginUser
);

router.post(
  "/logout",
  authMiddleware.verifyAndRevokeAccessToken,
  authController.logoutUser
);

router.post("/refresh-token", authController.refreshToken);

module.exports = router;
