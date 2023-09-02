/** @format */
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const secretKey = process.env.JWT_ACCESSSECRET;
const refreshSecretKey = process.env.JWT_REFRESHSECRET;

async function generateTokens(user) {
  const accessToken = jwt.sign(
    { userId: user._id, role: user.role },
    secretKey,
    { expiresIn: "1h" }
  );

  const version = user.refreshTokenVersion + 1;

  const refreshToken = jwt.sign(
    { userId: user._id, version },
    refreshSecretKey,
    { expiresIn: "30d" }
  );

  await User.updateOne(
    { _id: user._id },
    {
      $set: { refreshTokenVersion: version, refreshToken },
    }
  );

  return { accessToken, refreshToken };
}

module.exports = generateTokens;
