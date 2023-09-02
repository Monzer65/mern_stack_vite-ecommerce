/** @format */
const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_ACCESSSECRET;
const RevokedToken = require("../models/Revoke"); // Import the RevokedToken model

module.exports = {
  async verifyAndRevokeAccessToken(req, res, next) {
    try {
      // Get the access token from the request header
      const accessToken = req.headers["authorization"].split(" ")[1];
      if (!accessToken) {
        return res.status(401).send("Access token missing");
      }
      // Verify the access token using the secret key
      const payload = jwt.verify(accessToken, secretKey);
      // Check if the access token is in the revoked token collection
      const isRevoked = await RevokedToken.exists({ token: accessToken });
      if (isRevoked) {
        return res.status(401).send("Access token revoked");
      }
      // Access token is valid and not revoked, set the user id and role in req.user
      req.user = {
        userId: payload.userId,
        role: payload.role, // Assuming you have the role in the token payload
      };
      next();
    } catch (err) {
      console.error("Error during verification:", err);
      res.status(401).send("Access token invalid or expired");
    }
  },
};
