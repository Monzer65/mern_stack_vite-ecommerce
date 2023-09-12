/** @format */

const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const authMiddleware = require("../middlewares/authMiddleware");
const validationMiddleware = require("../middlewares/validationMiddleware");

router.get(
  "/",
  authMiddleware.verifyAndRevokeAccessToken,
  cartController.getCart
);

router.post(
  "/add",
  authMiddleware.verifyAndRevokeAccessToken,
  cartController.addItemToCart
);

router.post(
  "/addFromLocalStorageCart",
  authMiddleware.verifyAndRevokeAccessToken,
  cartController.addFromLocalStorageCartToDatabaseCart
);

router.post(
  "/updateQuantity",
  authMiddleware.verifyAndRevokeAccessToken,
  validationMiddleware.validateQuantityUpdate,
  cartController.modifyQuantityInCart
);

router.delete(
  "/delete/:productId",
  authMiddleware.verifyAndRevokeAccessToken,
  cartController.deleteCartItem
);

router.delete(
  "/clear",
  authMiddleware.verifyAndRevokeAccessToken,
  cartController.clearCart
);

module.exports = router;
