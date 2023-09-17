/** @format */

const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const categoryController = require("../controllers/categoryController");
const productController = require("../controllers/productController");
const profileController = require("../controllers/profileController");
const authMiddleware = require("../middlewares/authMiddleware");
const orderController = require("../controllers/orderController");

const checkAdminRole = (req, res, next) => {
  const user = req.user;

  if (user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }

  next();
};

router.get(
  "/dashboard",
  authMiddleware.verifyAndRevokeAccessToken,
  checkAdminRole,
  adminController.getDashboard
);

router.get(
  "/users",
  authMiddleware.verifyAndRevokeAccessToken,
  checkAdminRole,
  adminController.getUsers
);

router.get(
  "/recent-orders",
  authMiddleware.verifyAndRevokeAccessToken,
  checkAdminRole,
  orderController.getRecentOrders
);
router.get(
  "/filter-search-orders",
  authMiddleware.verifyAndRevokeAccessToken,
  checkAdminRole,
  orderController.filterAndSearchOrders
);
router.put(
  "/change-order-status/:orderId",
  authMiddleware.verifyAndRevokeAccessToken,
  checkAdminRole,
  orderController.changeOrderStatus
);

router.get(
  "/categories",
  authMiddleware.verifyAndRevokeAccessToken,
  checkAdminRole,
  categoryController.getCategories
);
router.post(
  "/categories",
  authMiddleware.verifyAndRevokeAccessToken,
  checkAdminRole,
  categoryController.createCategory
);
router.put(
  "/categories/:categoryId",
  authMiddleware.verifyAndRevokeAccessToken,
  checkAdminRole,
  categoryController.updateCategory
);
router.delete(
  "/categories/:categoryId",
  authMiddleware.verifyAndRevokeAccessToken,
  checkAdminRole,
  categoryController.deleteCategory
);
router.delete(
  "/categories/:categoryId/subcategories/:subcategoryId",
  authMiddleware.verifyAndRevokeAccessToken,
  checkAdminRole,
  categoryController.deleteSubcategory
);

router.get(
  "/products",
  authMiddleware.verifyAndRevokeAccessToken,
  checkAdminRole,
  productController.getAdminProducts
);
router.post(
  "/products",
  authMiddleware.verifyAndRevokeAccessToken,
  checkAdminRole,
  productController.createProduct
);
router.get(
  "/low-stock",
  authMiddleware.verifyAndRevokeAccessToken,
  checkAdminRole,
  productController.getLowStockProducts
);
router.get(
  "/reorder-suggestions",
  authMiddleware.verifyAndRevokeAccessToken,
  checkAdminRole,
  productController.getReorderSuggestions
);
router.put(
  "/products/:productId",
  authMiddleware.verifyAndRevokeAccessToken,
  checkAdminRole,
  productController.updateProduct
);
router.delete(
  "/products/:productId",
  authMiddleware.verifyAndRevokeAccessToken,
  checkAdminRole,
  productController.deleteProduct
);

router.get("/customers", checkAdminRole, profileController.getCustomersByAdmin);
router.get(
  "/customers/:customerId",
  checkAdminRole,
  profileController.getCustomerByIdByAdmin
);
router.put(
  "/customers/:customerId",
  checkAdminRole,
  profileController.updateCustomerByAdmin
);
router.delete(
  "/customers/:customerId",
  checkAdminRole,
  profileController.deleteCustomerByAdmin
);

module.exports = router;
