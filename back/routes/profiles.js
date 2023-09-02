/** @format */

const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");
const authMiddleware = require("../middlewares/authMiddleware");
const validationMiddleware = require("../middlewares/validationMiddleware");

router.get(
  "/",
  authMiddleware.verifyAndRevokeAccessToken,
  profileController.getUserProfile
);

router.put(
  "/update-name",
  authMiddleware.verifyAndRevokeAccessToken,
  validationMiddleware.validateUpdateName,
  profileController.updateName
);

router.put(
  "/update-email",
  authMiddleware.verifyAndRevokeAccessToken,
  validationMiddleware.validateUpdateEmail,
  profileController.updateEmail
);

router.post(
  "/verify-email",
  authMiddleware.verifyAndRevokeAccessToken,
  profileController.verifyAndUpdateEmail
);

router.put(
  "/update-phone",
  authMiddleware.verifyAndRevokeAccessToken,
  validationMiddleware.validateUpdatePhone,
  profileController.updatePhone
);

router.post(
  "/verify-phone",
  authMiddleware.verifyAndRevokeAccessToken,
  profileController.verifyAndUpdatePhone
);

router.put(
  "/update-password",
  authMiddleware.verifyAndRevokeAccessToken,
  validationMiddleware.validateUpdatePassword,
  profileController.updatePassword
);

router.put(
  "/update-address",
  authMiddleware.verifyAndRevokeAccessToken,
  validationMiddleware.validateUpdateAddress,
  profileController.updateAddress
);

module.exports = router;
