/** @format */
const validator = require("validator");

const phoneReg =
  /^([۰-۹]|0|(\+98)|0098|98)?([ ]|-|[()]){0,2}9([۱-۴]|\d)([ ]|-|[()]){0,2}(?:([۰-۹]|\d)([ ]|-|[()]){0,2}){8}$/;

function isValidPhoneNumber(str) {
  // Normalize the string to convert Persian digits to English digits
  str = str.normalize("NFKD").replace(/\p{M}/gu, "");

  // Check if the string matches the regex pattern with or without the country code
  if (phoneReg.test(str)) {
    return true;
  }

  // If the provided number doesn't match, try removing any leading 0 and retest
  const numberWithoutLeadingZero = str.replace(/^0+/, "");
  if (phoneReg.test(numberWithoutLeadingZero)) {
    return true;
  }

  return false;
}

function isValidEmail(email) {
  return validator.isEmail(email);
}

module.exports = { isValidEmail, isValidPhoneNumber };
