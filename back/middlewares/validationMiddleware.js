/** @format */

const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const {
  isValidEmail,
  isValidPhoneNumber,
} = require("../utiles/phoneEmailValidator");

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
      .withMessage({ msg: "Name is required", path: "name" }), // Add path property
    body("contact")
      .trim()
      .isLength({ max: 50 })
      .custom(async (value, { req }) => {
        if (!value) {
          throw {
            msg: "Email or Phone is required",
            path: "contact",
          };
        }

        const isEmail = isValidEmail(value);
        const isPhone = isValidPhoneNumber(value);
        const existingUser = await User.findOne({
          $or: [
            { email: value },
            { phone: isPhone ? formatPhoneNumber(value) : "" },
          ],
        });

        if (existingUser && existingUser.isVerified) {
          throw {
            msg: "User is already verified",
            path: "contact",
          };
        }

        if (!isEmail && !isPhone) {
          throw {
            msg: "Please provide a valid email or phone",
            path: "contact",
          };
        }

        if (
          existingUser &&
          !existingUser.isVerified &&
          existingUser.verificationCodeExpiration > Date.now()
        ) {
          throw {
            msg: "Verification is in progress",
            path: "contact",
          };
        }
        return true;
      }),
    body("password")
      .trim()
      .isLength({ max: 50 })
      .notEmpty()
      .isLength({ min: 6 })
      .withMessage({ msg: "Password is required", path: "password" }), // Add path property
    body("repeatPassword")
      .trim()
      .isLength({ max: 50 })
      .custom((value, { req }) => value === req.body.password)
      .withMessage({
        msg: "Passwords do not match",
        path: "repeatPassword",
      }), // Add path property
  ],

  validateResendCode: [
    body("email")
      .trim()
      .isLength({ max: 50 })
      .if(body("phone").isEmpty())
      .isEmail()
      .withMessage("Invalid email format")
      .custom(async (value) => {
        const existingUser = await User.findOne({ email: value });
        if (existingUser && existingUser.isVerified) {
          throw new Error("email is already verified");
        }
        return true;
      })
      .normalizeEmail(),
    body("phone")
      .trim()
      .isLength({ max: 20 })
      .if(body("email").isEmpty())
      .isMobilePhone()
      .withMessage("Invalid phone number")
      .custom(async (value) => {
        const existingUser = await User.findOne({ phone: value });
        if (existingUser && existingUser.isVerified) {
          throw new Error("Phone number is already verified");
        }
        return true;
      })
      .normalizeEmail(),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);
        return res.status(400).json({ errors: errorMessages });
      }
      next();
    },
  ],

  validateLogin: [
    body("contact")
      .trim()
      .isLength({ max: 50 })
      .notEmpty()
      .custom((value) => {
        // Normalize and format the contact value (email or phone)
        const formattedContact = isValidPhoneNumber(value)
          ? formatPhoneNumber(value)
          : isValidEmail(value)
          ? value
          : null;

        if (!formattedContact) {
          throw new Error("Invalid email or phone number format");
        }

        return true;
      })
      .withMessage("Email or phone number is required"),
    body("password").trim().notEmpty().withMessage("Password is required"),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);
        return res.status(400).json({ errors: errorMessages });
      }
      next();
    },
  ],

  validateUpdateName: [
    // Add validation rules using body() function
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
      .optional()
      .trim()
      .isNumeric()
      .withMessage("Postal code must be digits")
      .isLength({ min: 10, max: 10 })
      .withMessage("Postal code must be 10 characters"),
    body("postalPhone")
      .optional()
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Postal phone must be between 4 and 20 characters")
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
