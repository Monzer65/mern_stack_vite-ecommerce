/** @format */

const generateVerificationCode = () => {
  const verificationCode = Math.floor(100000 + Math.random() * 900000);
  const verificationCodeExpiration = Date.now() + 5 * 60 * 1000; // 5 min
  return { verificationCode, verificationCodeExpiration }; // return an object with the properties
};

module.exports = {
  generateVerificationCode,
};
