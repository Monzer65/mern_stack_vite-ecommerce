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
      const { name, contact, password } = req.body;

      const isEmail = isValidEmail(contact);
      const isPhone = isValidPhoneNumber(contact);
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const existingUser = await User.findOne({
        $or: [
          { email: isEmail ? contact.toLowerCase() : null },
          { phone: isPhone ? contact : null },
        ],
      });

      if (existingUser && existingUser.isVerified) {
        return res.status(400).json({ error: "کاربر قبلا ثبت نام کرده است" });
      }

      if (
        existingUser &&
        !existingUser.isVerified &&
        existingUser.verificationCodeExpiration > Date.now()
      ) {
        return res.status(409).json({
          error: "شما قبلا درخواست کد داده اید",
        });
      }

      if (
        existingUser &&
        !existingUser.isVerified &&
        existingUser.verificationCodeExpiration < Date.now()
      ) {
        try {
          await User.deleteOne({ _id: existingUser._id });
        } catch (error) {
          console.error("Error during deleting user", error);
        }
      }

      const newUser = new User({
        name,
        email: isEmail ? contact.toLowerCase() : "",
        phone: isPhone ? contact : "",
        password,
        isVerified: false,
      });

      await newUser.save();

      if (isPhone) {
        await sendCodeToPhone(newUser, contact);
      } else if (isEmail) {
        await sendCodeToEmail(newUser, contact);
      }

      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "server Error" });
    }
  },

  async verifyUser(req, res) {
    const { contact, verificationCode } = req.body;
    let user;

    try {
      if (!contact) {
        return res.status(404).json({ error: "اول ثبت نام کنید" });
      }

      if (contact.includes("@")) {
        user = await User.findOne({ email: contact.toLowerCase() });
      } else {
        user = await User.findOne({ phone: contact });
      }

      if (!user) {
        return res.status(404).json({ error: "کاربر پیدا نشد" });
      }

      if (user.isVerified) {
        return res.status(400).json({ error: "کاربر قبلا تایید شده است" });
      }

      if (user.verificationCodeExpiration < Date.now()) {
        return res.status(400).json({ error: "کد تایید منقضی شده است" });
      }

      if (user.verificationCode === verificationCode) {
        if (!user.isVerified) {
          user.isVerified = true;
          user.verificationCode = "";
          user.verificationCodeExpiration = "";
          await user.save();

          const tokens = await generateTokens(user);

          res.cookie("refreshToken", tokens.refreshToken, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
          });

          res.status(200).json({
            message: "تایید موفق",
            accessToken: tokens.accessToken,
            roles: user.roles,
          });
        }
      } else {
        return res.status(400).json({ error: "کد تایید نامعتبر است" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "server error" });
    }
  },

  async resendCode(req, res) {
    const { contact } = req.body;
    let user;

    try {
      if (!contact) {
        return res.status(404).json({ error: "هنوز ثبت نام نکرده اید" });
      }

      if (contact.includes("@")) {
        user = await User.findOne({ email: contact.toLowerCase() });
      } else {
        user = await User.findOne({ phone: contact });
      }

      if (!user) {
        return res.status(404).json({ error: "کاربر پیدا نشد" });
      }

      if (user.isVerified) {
        return res.status(400).json({ error: "کاربر قبلا تایید شده است" });
      } else {
        if (contact === user.phone) {
          await sendCodeToPhone(user, contact);
        } else if (contact.toLowerCase() === user.email) {
          await sendCodeToEmail(user, contact);
        }
        res.status(200).json({
          message: "کد با موفقیت ارسال شد",
        });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "server error" });
    }
  },

  async loginUser(req, res) {
    try {
      const { contact, password } = req.body;
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const user = await User.findOne({
        $or: [
          { email: contact },
          { phone: formatPhoneNumber(contact) },
          { phone: `0${contact}` },
          { phone: `+98${contact.slice(1)}` },
        ],
      });

      if (!user) {
        return res.status(404).json({ error: "کاربر پیدا نشد" });
      }

      if (!user.isVerified) {
        return res.status(404).json({ error: "کاربر هنوز تایید نشده است" });
      }

      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res
          .status(401)
          .json({ error: "نام کاربری یا پسورد نامعتبر است" });
      }

      const tokens = await generateTokens(user);
      res.cookie("refreshToken", tokens.refreshToken, {
        domain: "localhost",
        httpOnly: true,
        sameSite: "strict", // Protect against CSRF
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });

      res.json({
        message: "ورود موفق",
        accessToken: tokens.accessToken,
        userName: user.name,
      });
    } catch (err) {
      console.error("Error during login:", err);
      res.status(500).json({ error: "Server error" });
    }
  },

  async logoutUser(req, res) {
    try {
      const userId = req.user.userId;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).send("کاربر پیدا نشد");
      }

      const oldAccessToken = req.headers.authorization.split(" ")[1];

      if (oldAccessToken) {
        // Create a new RevokedToken document for the old access token
        await RevokedToken.create({ token: oldAccessToken, user: user._id });
      }

      await User.updateOne(
        { _id: userId },
        {
          $inc: { refreshTokenVersion: 1 },
          $set: { refreshToken: null },
        }
      );

      const cookies = req.cookies;
      const refreshToken = cookies.refreshToken;

      res.clearCookie("refreshToken", refreshToken, {
        domain: "localhost",
      });

      res.json({
        message: "خروج موفق",
      });
    } catch (err) {
      console.error("Error during logout:", err);
      res.status(500).json({ error: "Server error" });
    }
  },

  async refreshToken(req, res) {
    const cookies = req.cookies;

    const refreshToken = cookies.refreshToken;

    if (!refreshToken) {
      return res.status(403).json("توکن رفرش یافت نشد");
    }

    try {
      const payload = jwt.verify(refreshToken, refreshSecretKey);
      // Find the user associated with the refresh token
      const user = await User.findById(payload.userId);

      if (!user) {
        return res.status(401).json("کاربر یافت نشد");
      }

      if (user.refreshTokenVersion !== payload.version) {
        return res.status(403).json("توکن رفرش نامعتبر است");
      }

      const oldAccessToken = req.headers.authorization.split(" ")[1];

      if (oldAccessToken) {
        // Create a new RevokedToken document for the old access token
        await RevokedToken.create({ token: oldAccessToken });
      }

      const tokens = await generateTokens(user);

      res.cookie("refreshToken", tokens.refreshToken, {
        domain: "localhost",
        httpOnly: true,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, // 1 days
      });

      // Return the new access token
      res.json({
        accessToken: tokens.accessToken,
        userName: user.name,
      });
    } catch (err) {
      res.status(500).json("Server error brooo");
    }
  },
};
