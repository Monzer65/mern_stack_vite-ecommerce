/** @format */

const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const {
  isValidEmail,
  isValidPhoneNumber,
} = require("../utiles/phoneEmailValidator");

const isValidContact = (value) => {
  return isValidEmail(value) || isValidPhoneNumber(value);
};

function formatPhoneNumber(phone) {
  // Normalize the phone number to remove any non-digit characters
  const normalizedPhone = phone.replace(/\D/g, "");
  // Add the leading 0 if missing
  const formattedPhone = normalizedPhone.startsWith("0")
    ? normalizedPhone
    : "0" + normalizedPhone;

  return formattedPhone;
}

module.exports = {
  validateRegistration: [
    body("name")
      .trim()
      .isLength({ max: 50 })
      .notEmpty()
      .withMessage("Name is required")
      .escape(),
    body("contact")
      .trim()
      .notEmpty()
      .withMessage("Contact is required")
      .bail()
      .custom(isValidContact)
      .withMessage("Invalid email address or phone number")
      .escape(),

    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is required")
      .bail()
      .isLength({ min: 6, max: 50 })
      .withMessage("Password must be at least 6 characters long")
      .escape(),

    body("repeatPassword")
      .trim()
      .isLength({ max: 50 })
      .custom((value, { req }) => value === req.body.password)
      .withMessage("Passwords do not match")
      .escape(),
  ],

  validateLogin: [
    body("contact")
      .trim()
      .notEmpty()
      .withMessage("Contact is required")
      .bail()
      .custom(isValidContact)
      .withMessage("Invalid email address or phone number")
      .escape(),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is required")
      .bail()
      .escape(),
  ],

  validateUpdateName: [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Name cannot be empty")
      .isLength({ min: 2, max: 50 })
      .withMessage("Name must be at least 2 characters long"),
  ],

  validateUpdatePassword: [
    body("oldPassword").notEmpty().withMessage("Old password is required"),
    body("newPassword")
      .trim()
      .notEmpty()
      .withMessage("New password cannot be empty")
      .isLength({ min: 6, max: 50 })
      .withMessage("New password must be at least 6 characters long")
      .custom((value, { req }) => {
        if (value === req.body.oldPassword) {
          throw new Error("New password must be different from old password");
        }
        return true;
      }),
  ],

  validateUpdateAddress: [
    body("postalCode")
      .optional({ checkFalsy: true })
      .trim()
      .isLength({ min: 10, max: 10 })
      .withMessage("Postal code must be 10 characters")
      .bail()
      .isNumeric()
      .withMessage("Postal code must be digits"),

    body("postalPhone")
      .optional({ checkFalsy: true })
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Postal phone must be between 4 and 20 characters")
      .bail()
      .isMobilePhone()
      .withMessage("Invalid phone number"),

    body("apartment")
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage("Apartment name should not exceed 50 characters"),

    body("street")
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage("Street name should not exceed 100 characters"),

    body("city")
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage("City name should not exceed 50 characters"),

    body("province")
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage("Province name should not exceed 50 characters"),
  ],

  validateUpdateEmail: [
    body("newEmail")
      .trim()
      .isLength({ max: 50 })
      .isEmail()
      .withMessage("Invalid email format"),
  ],

  validateUpdatePhone: [
    body("newPhone")
      .trim()
      .isLength({ max: 50 })
      .isMobilePhone()
      .withMessage("Invalid phone format"),
  ],

  validateReviewAdd: [
    body("rating")
      .isInt({ min: 1, max: 5 })
      .withMessage("Rating must be between 1 and 5")
      .notEmpty(),
    body("title")
      .isString()
      .withMessage("Title must be a string")
      .trim()
      .notEmpty(),
    body("comment")
      .isString({ max: 1000 })
      .trim()
      .withMessage("Comment must be a string")
      .notEmpty(),
  ],

  validateReviewUpdate: [
    body("rating")
      .optional()
      .isInt({ min: 1, max: 5 })
      .withMessage("Rating must be between 1 and 5"),
    body("title")
      .optional()
      .isString()
      .withMessage("Title must be a string")
      .trim(),
    body("comment")
      .optional()
      .isString({ max: 1000 })
      .trim()
      .withMessage("Comment must be a string"),
  ],

  validateQuantityUpdate: [
    body("quantity")
      .isInt({ min: 1, max: 10 })
      .withMessage("Quantity must be an integer between 1 and 10"),
  ],
};
