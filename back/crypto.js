/** @format */

const crypto = require("crypto");

// Generate a random string with 64 characters (32 bytes in hexadecimal)
const randomString = crypto.randomBytes(32).toString("hex");
console.log(randomString);
