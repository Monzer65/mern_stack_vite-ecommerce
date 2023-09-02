/** @format */
// models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const {
  isValidEmail,
  isValidPhoneNumber,
} = require("../utiles/phoneEmailValidator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    sparse: true,
    validate: {
      validator: async function (value) {
        // Skip validation if value is empty or null
        if (!value) return true;
        // Check if email is valid
        const isValid = isValidEmail(value);
        // Return true if both conditions are met, false otherwise
        return isValid;
      },
      message: (props) =>
        `${props.value} is not a valid email or email is already provided`,
    },
  },
  phone: {
    type: String,
    sparse: true,
    validate: {
      validator: async function (value) {
        // Skip validation if value is empty or null
        if (!value) return true;
        // Check if phone is valid
        const isValid = isValidPhoneNumber(value);
        // Return true if both conditions are met, false otherwise
        return isValid;
      },
      message: (props) =>
        `${props.value} is not a valid phone or phone is already provided`,
    },
  },

  newEmail: {
    type: String,
    unique: true,
    sparse: true,
    validate: {
      validator: function (value) {
        return isValidEmail(value);
      },
      message: (props) => `${props.value} is not a valid email`,
    },
    verified: Boolean,
  },
  newPhone: {
    type: String,
    unique: true,
    sparse: true,
    validate: {
      validator: function (value) {
        return isValidPhoneNumber(value);
      },
      message: (props) => `${props.value} is not a valid phone`,
    },
    verified: Boolean,
  },
  lastEmailUpdate: {
    type: Date,
    default: null,
  },
  lastPhoneUpdate: {
    type: Date,
    default: null,
  },
  password: {
    type: String,
    required: true,
  },
  verificationCode: String,
  verificationCodeExpiration: Date,
  isVerified: {
    type: Boolean,
    default: false,
  },
  codesSent: {
    count: { type: Number, default: 0 },
    lastSent: Date,
  },
  cooldownUntil: Date,
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  postalCode: {
    type: String,
    default: "",
  },
  postalPhone: {
    type: String,
    default: "",
  },
  apartment: {
    type: String,
    default: "",
  },
  street: {
    type: String,
    default: "",
  },
  city: {
    type: String,
    default: "",
  },
  province: {
    type: String,
    default: "",
  },
  refreshToken: {
    type: String,
    default: "",
  },
  refreshTokenVersion: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Function to set the password hash before saving the user
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(this.password, salt);
      this.password = hash;
    } catch (err) {
      return next(err);
    }
  }
  next();
});

// Function to compare the password with the stored hash
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (err) {
    throw err;
  }
};

userSchema.methods.generateVerificationCode = function () {
  const code = Math.floor(100000 + Math.random() * 900000);
  const expiration = Date.now() + 5 * 60 * 1000;
  this.verificationCode = code;
  this.verificationCodeExpiration = expiration;
  return { code, expiration };
};

const User = mongoose.model("User", userSchema);

module.exports = User;
