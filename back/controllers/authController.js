/** @format */

const User = require("../models/User");
const RevokedToken = require("../models/Revoke");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const {
  isValidEmail,
  isValidPhoneNumber,
} = require("../utiles/phoneEmailValidator");
const { generateVerificationCode } = require("../utiles/otpGenerator");
const { sendSMS, sendEmail } = require("../utiles/otpSender");
const generateTokens = require("../utiles/jwtGenerator");

const refreshSecretKey = process.env.JWT_REFRESHSECRET;
const SMS_USERNAME = process.env.SMS_USERNAME;
const SMS_PASSWORD = process.env.SMS_PASSWORD;
const EMAIL_ADDRESS = process.env.EMAIL_ADDRESS;

const HTTP_STATUS = {
  // Successful responses
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  // Redirection messages
  MOVED_PERMANENTLY: 301,
  FOUND: 302,
  NOT_MODIFIED: 304,
  // Client error responses
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  // Server error responses
  SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
};

const ERROR_MESSAGES = {
  // Client error messages
  INVALID_INPUT: "Invalid input data",
  EMAIL_PHONE_REQUIRED: "At least one of email or phone must be provided",
  USER_ALREADY_VERIFIED: "User already verified",
  VERIFICATION_IN_PROGRESS: "Verification in progress. Use verify route.",
  VERIFICATION_CODE_EXPIRED: "Code expired, try a new one",
  UNAUTHORIZED: "You are not authorized to access this resource",
  FORBIDDEN: "You are forbidden from performing this action",
  NOT_FOUND: "The resource you requested was not found",
  METHOD_NOT_ALLOWED: "The method you used is not allowed for this resource",
  CONFLICT: "There is a conflict with the current state of the resource",
  TOO_MANY_REQUESTS: "You have exceeded the rate limit for this service",
  // Server error messages
  SERVER_ERROR: "Server error",
  NOT_IMPLEMENTED: "The feature you requested is not implemented yet",
};

async function sendCodeToEmail(user, contact) {
  const { verificationCode, verificationCodeExpiration } =
    generateVerificationCode();
  await sendEmail(
    EMAIL_ADDRESS,
    contact,
    "Verification code",
    `Your verification code is: ${verificationCode}`
  );
  await User.updateOne(
    { _id: user._id },
    {
      $set: {
        verificationCode: verificationCode,
        verificationCodeExpiration: verificationCodeExpiration,
        "codesSent.count": user.codesSent.count + 1,
        "codesSent.lastSent": Date.now(),
      },
    }
  );
}

async function sendCodeToPhone(user, contact) {
  const verificationCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString();
  const verificationCodeExpiration = Date.now() + 3 * 60 * 1000;
  await sendSMS(
    SMS_USERNAME,
    SMS_PASSWORD,
    "10002147",
    contact,
    "مشترک گرامی، کد شما: " + verificationCode + " میباشد."
  );
  await User.updateOne(
    { _id: user._id },
    {
      $set: {
        verificationCode: verificationCode,
        verificationCodeExpiration: verificationCodeExpiration,
        "codesSent.count": user.codesSent.count + 1,
        "codesSent.lastSent": Date.now(),
      },
    }
  );
}

function getAnonymousCartFromLocalStorage() {
  const cartJSON = localStorage.getItem("anonymousCart");
  return cartJSON ? JSON.parse(cartJSON) : [];
}

function clearAnonymousCartFromLocalStorage() {
  localStorage.removeItem("anonymousCart");
}

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
  async registerUser(req, res) {
    try {
      const { name, contact, password, repeatPassword } = req.body;
      const isEmail = isValidEmail(contact);
      const isPhone = isValidPhoneNumber(contact);
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);
        console.log(errors);
        return res.status(400).json({ errors: errorMessages });
      }

      const user = await User.findOne({
        $or: [{ email: contact }, { phone: contact }],
      });

      if (
        user &&
        !user.isVerified &&
        user.verificationCodeExpiration < Date.now()
      ) {
        try {
          await User.deleteOne({ _id: user._id });
        } catch (error) {
          console.error("Error during deleting user", error);
        }
      }
      const formattedPhone = formatPhoneNumber(contact);

      const newUser = new User({
        name,
        email: isEmail ? contact : "",
        phone: isPhone ? formattedPhone : "",
        password,
        isVerified: false,
      });

      await newUser.save();

      if (isPhone) {
        await sendCodeToPhone(newUser, newUser.phone);
      } else if (isEmail) {
        await sendCodeToEmail(newUser, newUser.email);
      }

      newUser.codesSent.count += 1;
      await newUser.save();

      res.json({ success: true });
    } catch (err) {
      console.error("There was an error registering the user.", err);
      res
        .status(HTTP_STATUS.SERVER_ERROR)
        .json({ error: ERROR_MESSAGES.SERVER_ERROR });
    }
  },

  async resendCode(req, res) {
    try {
      const { email, phone } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);
        return res.status(400).json({ errors: errorMessages });
      }

      const user = await User.findOne({ $or: [{ email }, { phone }] });
      if (!user) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .json({ message: "User not found" });
      }

      if (user.cooldownUntil) {
        if (Date.now() > user.cooldownUntil) {
          user.cooldownUntil = undefined;
          user.codesSent.count = 1;

          await user.save();
        }
      }

      // Check cooldown
      if (user.cooldownUntil && Date.now() < user.cooldownUntil) {
        return res.send("Your requests are on cooldown");
      }

      // Set cooldown if needed
      if (user.codesSent.count >= 3) {
        const cooldownTime = Date.now() + 180000;
        await User.updateOne(
          { _id: user._id },
          { $set: { cooldownUntil: cooldownTime } }
        );
        res.json({ onCooldown: true });
      } else {
        if (user.phone && !user.isVerified) {
          await sendCodeToPhone(user, user.phone);
        } else if (user.email && !user.isVerified) {
          await sendCodeToEmail(user, user.email);
        }
        res.json({ success: true });
      }

      // Send code
    } catch (err) {
      console.error("Error resending verification code:", err);
      res.status(HTTP_STATUS.SERVER_ERROR).send(ERROR_MESSAGES.SERVER_ERROR);
    }
  },

  async verifyUser(req, res) {
    const { email, phone, verificationCode } = req.body;
    let user;
    if (email) {
      user = await User.findOne({ email });
    } else if (phone) {
      user = await User.findOne({
        $or: [{ phone }, { phone: formatPhoneNumber(phone) }],
      });
    }

    try {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.isVerified) {
        return res.status(400).send("User already verified");
      }

      if (user.verificationCodeExpiration < Date.now()) {
        return res.status(400).json({ message: "Verification code expired" });
      }

      if (user.verificationCode === verificationCode) {
        if (!user.isVerified) {
          user.isVerified = true;
          user.verificationCode = "";
          user.verificationCodeExpiration = "";
          user.codesSent.count = 1;
          await user.save();

          const tokens = await generateTokens(user);
          res.cookie("refreshToken", tokens.refreshToken, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
          });

          res.json({
            message: "Verification successful",
            accessToken: tokens.accessToken,
          });
        }
      } else {
        return res.status(400).send("Invalid verification code");
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  },

  async loginUser(req, res) {
    const { contact, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findOne({
        $or: [
          { email: contact },
          { phone: formatPhoneNumber(contact) },
          { phone: `0${contact}` },
          { phone: `+98${contact.slice(1)}` },
        ],
      });

      if (!user) {
        return res.status(404).send("User not found");
      }
      // Compare the provided password with the user's hashed password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).send("Invalid password");
      }

      const tokens = await generateTokens(user);
      res.cookie("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        // secure: true, // Use HTTPS
        sameSite: "strict", // Protect against CSRF
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      res.json({
        message: "Login successful",
        role: user.role,
        userId: user._id,
        accessToken: tokens.accessToken,
      });

      // const anonymousCart = getAnonymousCartFromLocalStorage(); // Retrieve from local storage

      // if (anonymousCart.length > 0) {
      //   const existingUserCart = await Cart.findOne({ userId: user._id });

      //   if (existingUserCart) {
      //     // Merge anonymous cart with user's existing cart
      //     anonymousCart.forEach((item) => {
      //       const existingItemIndex = existingUserCart.products.findIndex(
      //         (p) => p.productId.toString() === item.productId
      //       );
      //       if (existingItemIndex !== -1) {
      //         existingUserCart.products[existingItemIndex].quantity +=
      //           item.quantity;
      //       } else {
      //         existingUserCart.products.push({
      //           productId: item.productId,
      //           quantity: item.quantity,
      //         });
      //       }
      //     });

      //     await existingUserCart.save();
      // } else {
      //   // Create a new cart with anonymous cart items
      //   await Cart.create({ userId: user._id, products: anonymousCart });
      // }

      // // Clear anonymous cart data from local storage
      // clearAnonymousCartFromLocalStorage();
      // }
    } catch (err) {
      console.error("Error during login:", err);
      res.status(500).send("Server error");
    }
  },

  async logoutUser(req, res) {
    try {
      const userId = req.user.userId;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).send("User not found");
      }

      const accessToken = req.headers["authorization"].split(" ")[1];
      if (!accessToken) {
        return res.status(401).send("Access token missing");
      }

      // Store the revoked access token in the database
      const revokedToken = new RevokedToken({ token: accessToken });
      await revokedToken.save();

      await User.updateOne(
        { _id: userId },
        {
          $inc: { refreshTokenVersion: 1 },
          $set: { refreshToken: null },
        }
      );

      res.clearCookie("refreshToken");
      res.json({
        message: "Logout successful",
      });
    } catch (err) {
      console.error("Error during logout:", err);
      res.status(500).send("Server error");
    }
  },

  async refreshToken(req, res) {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(401).send("Refresh token missing");
    }
    try {
      const payload = jwt.verify(refreshToken, refreshSecretKey);
      // Find the user associated with the refresh token
      const user = await User.findById(payload.userId);
      if (!user) {
        return res.status(401).send("User not found");
      }
      if (user.refreshTokenVersion !== payload.version) {
        return res.status(401).send("Invalid refresh token");
      }

      const accessToken = req.headers.authorization.split(" ")[1];
      if (accessToken) {
        // Create a new RevokedToken document for the current access token
        await RevokedToken.create({ token: accessToken, user: user._id });
      }

      const tokens = await generateTokens(user);
      res.cookie("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });
      // Return the new access token
      res.json({ accessToken: tokens.accessToken });
    } catch (err) {
      console.error("Error during token refresh:", err);
      res.status(500).send("Server error");
    }
  },
};
