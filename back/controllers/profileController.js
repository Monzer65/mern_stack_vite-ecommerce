/** @format */

const User = require("../models/User");
const { validationResult } = require("express-validator");
const {
  isValidEmail,
  isValidPhoneNumber,
} = require("../utiles/phoneEmailValidator");
const { sendSMS, sendEmail } = require("../utiles/otpSender");
const SMS_USERNAME = process.env.SMS_USERNAME;
const SMS_PASSWORD = process.env.SMS_PASSWORD;
const EMAIL_ADDRESS = process.env.EMAIL_ADDRESS;
// Constants for time values in milliseconds
const ONE_DAY = 24 * 60 * 60 * 1000;
const ONE_MONTH = 30 * ONE_DAY;
const THREE_MINUTES = 3 * 60 * 1000;

async function sendCodeToEmail(user, contact) {
  const verificationCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString();
  const verificationCodeExpiration = Date.now() + THREE_MINUTES;

  await sendEmail(
    EMAIL_ADDRESS,
    contact,
    "Verification code",
    `Your verification code is: ${verificationCode}`
  );
  user.verificationCode = verificationCode;
  user.verificationCodeExpiration = verificationCodeExpiration;
  user.codesSent.count += 1;
  user.codesSent.lastSent = Date.now();
  await user.save();
}

async function sendCodeToPhone(user, contact) {
  const verificationCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString();
  const verificationCodeExpiration = Date.now() + THREE_MINUTES;

  await sendSMS(
    SMS_USERNAME,
    SMS_PASSWORD,
    "10002147",
    contact,
    "مشترک گرامی، کد شما: " + verificationCode + " میباشد."
  );
  user.codesSent.count += 1;
  user.codesSent.lastSent = Date.now();
  user.verificationCode = verificationCode;
  user.verificationCodeExpiration = verificationCodeExpiration;
  await user.save();
}

// Function to check if a profile has a new email that was updated less than a month ago
const hasRecentEmailUpdate = (profile) => {
  const currentTime = Date.now();
  return (
    profile.lastEmailUpdate && currentTime - profile.lastEmailUpdate < ONE_MONTH
  );
};

const hasRecentPhoneUpdate = (profile) => {
  const currentTime = Date.now();
  return (
    profile.lastPhoneUpdate && currentTime - profile.lastPhoneUpdate < ONE_MONTH
  );
};

module.exports = {
  async getCustomersByAdmin(req, res) {
    try {
      const customers = await User.find({ role: "user" }).select("-password");
      res.json(customers);
    } catch (error) {
      console.error("Error getting customers:", error);
      res.status(500).send("Server error");
    }
  },

  async getCustomerByIdByAdmin(req, res) {
    try {
      const customerId = req.params.customerId;
      const customer = await User.findOne({
        _id: customerId,
        role: "user",
      }).select("-password");
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }
      res.json(customer);
    } catch (error) {
      console.error("Error getting customer by ID:", error);
      res.status(500).send("Server error");
    }
  },

  async updateCustomerByAdmin(req, res) {
    try {
      const customerId = req.params.customerId;
      const updatedData = req.body;

      const customer = await User.findOneAndUpdate(
        { _id: customerId, role: "user" },
        updatedData,
        { new: true }
      ).select("-password");

      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }

      res.json(customer);
    } catch (error) {
      console.error("Error updating customer:", error);
      res.status(500).send("Server error");
    }
  },

  async deleteCustomerByAdmin(req, res) {
    try {
      const customerId = req.params.customerId;

      const customer = await User.findOneAndDelete({
        _id: customerId,
        role: "user",
      });

      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }

      res.json({ message: "Customer deleted successfully" });
    } catch (error) {
      console.error("Error deleting customer:", error);
      res.status(500).send("Server error");
    }
  },

  async getUserProfile(req, res) {
    try {
      const userId = req.user.userId;
      const role = req.user.role;

      const profile = await User.findById(userId);
      if (!profile) {
        return res.status(404).json({ error: "User not found" });
      }

      let selectedFields = {};
      if (role === "admin") {
        // Include all fields for admin
        selectedFields = profile.toObject(); // Convert the document to a plain object
      } else {
        // Include only specific fields for non-admin users
        selectedFields.name = profile.name;
        selectedFields.email = profile.email;
        selectedFields.phone = profile.phone;
        selectedFields.postalCode = profile.postalCode;
        selectedFields.apartment = profile.apartment;
        selectedFields.street = profile.street;
        selectedFields.city = profile.city;
        selectedFields.province = profile.province;
      }
      // Construct the response JSON object
      const responseObject = {
        profile: selectedFields,
        role,
      };
      // Send the response
      res.json(responseObject);
    } catch (err) {
      console.error("Error during profile retrieval:", err);
      res.status(500).json({ error: "Server error" });
    }
  },

  async updateName(req, res) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);
        return res.status(400).json({ errors: errorMessages });
      }

      const userId = req.user.userId;
      const newName = req.body.name;
      const profile = await User.findById(userId);
      if (!profile) {
        return res.status(404).send("User not found");
      }
      profile.name = newName;
      await profile.save();

      res.json({ message: "Name updated successfully" });
    } catch (error) {
      console.error("Error during updating name:", error);
      res.status(500).send("Server error");
    }
  },

  async updatePassword(req, res) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);
        return res.status(400).json({ errors: errorMessages });
      }

      const userId = req.user.userId;
      const { oldPassword, newPassword } = req.body;

      const profile = await User.findById(userId);
      if (!profile) {
        return res.status(404).send("User not found");
      }

      const isOldPasswordValid = await profile.comparePassword(oldPassword);
      if (!isOldPasswordValid) {
        return res.status(401).send("Invalid old password");
      }

      profile.password = newPassword;
      await profile.save();

      res.json({ message: "password updated successfully" });
    } catch (error) {
      console.error("Error during updating password:", error);
      res.status(500).send("Server error");
    }
  },

  async updateAddress(req, res) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);
        return res.status(400).json({ errors: errorMessages });
      }

      const userId = req.user.userId;
      const newPostalCode = req.body.postalCode;
      const newPostalPhone = req.body.postalPhone;
      const newApartment = req.body.apartment;
      const newStreet = req.body.street;
      const newCity = req.body.city;
      const newProvince = req.body.province;

      const profile = await User.findById(userId);
      if (!profile) {
        return res.status(404).send("User not found");
      }

      // Update fields only if they are not empty
      if (newPostalCode !== undefined && newPostalCode !== "")
        profile.postalCode = newPostalCode;
      if (newPostalPhone !== undefined && newPostalPhone !== "")
        profile.postalPhone = newPostalPhone;
      if (newApartment !== undefined && newApartment !== "")
        profile.apartment = newApartment;
      if (newStreet !== undefined && newStreet !== "")
        profile.street = newStreet;
      if (newCity !== undefined && newCity !== "") profile.city = newCity;
      if (newProvince !== undefined && newProvince !== "")
        profile.province = newProvince;

      await profile.save();

      res.json({ message: "Address updated successfully" });
    } catch (error) {
      console.error("Error during updating address:", error);
      res.status(500).send("Server error");
    }
  },

  async updateEmail(req, res) {
    try {
      const { newEmail } = req.body;
      const userId = req.user.userId;
      const profile = await User.findById(userId);
      const errors = validationResult(req);

      if (hasRecentEmailUpdate(profile)) {
        return res.status(429).send("You can update email only once per month");
      }

      if (!profile) {
        return res.status(404).send("User not found");
      }

      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);
        return res.status(400).json({ errors: errorMessages });
      }

      if (!isValidEmail(newEmail)) {
        return res.status(400).json({ errors: ["Invalid email format"] });
      }

      const emailInUse = await User.findOne({ email: newEmail });
      if (emailInUse) {
        return res.status(400).send("Email is already in use");
      }

      const currentTime = Date.now();

      if (profile.cooldownUntil) {
        if (Date.now() > profile.cooldownUntil) {
          profile.cooldownUntil = undefined;
          profile.codesSent.count = 1;

          await profile.save();
        }
      }

      if (profile.cooldownUntil && Date.now() < profile.cooldownUntil) {
        return res.send("Your requests are on cooldown");
      }

      if (profile.codesSent.count >= 3) {
        const cooldownTime = Date.now() + 180000;
        await User.updateOne(
          { _id: profile._id },
          { $set: { cooldownUntil: cooldownTime } }
        );
        res.json({ onCooldown: true });
      } else {
        profile.newEmail = newEmail;
        await sendCodeToEmail(profile, profile.newEmail);
        await profile.save();
        res.json({ success: true });
      }
    } catch (error) {
      console.error("Error during updating email:", error);
      res.status(500).send("Server error");
    }
  },

  async verifyAndUpdateEmail(req, res) {
    try {
      const { verificationCode } = req.body;
      const userId = req.user.userId;
      const profile = await User.findById(userId);
      const currentTime = Date.now();

      if (!profile) {
        return res.status(404).send("User not found");
      }

      if (!profile.newEmail) {
        return res.status(400).send("No pending email update found");
      }

      if (currentTime > profile.verificationCodeExpiration) {
        return res.status(400).send("Verification code expired");
      }

      if (profile.verificationCode === verificationCode) {
        profile.email = profile.newEmail;
        profile.newEmail = undefined;
        profile.verificationCode = "";
        profile.verificationCodeExpiration = "";
        profile.lastEmailUpdate = currentTime;
        profile.codesSent.count = 1;
        await profile.save();
        res.json({ message: "Email updated successfully" });
      } else {
        return res.status(400).send("Invalid verification code");
      }
    } catch (error) {
      console.error("Error during email verification:", error);
      res.status(500).send("Server error");
    }
  },

  async updatePhone(req, res) {
    try {
      const { newPhone } = req.body;
      const userId = req.user.userId;
      const profile = await User.findById(userId);
      const errors = validationResult(req);

      if (hasRecentPhoneUpdate(profile)) {
        return res.status(429).send("You can update phone only once per month");
      }

      if (!profile) {
        return res.status(404).send("User not found");
      }

      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);
        return res.status(400).json({ errors: errorMessages });
      }

      if (!isValidPhoneNumber(newPhone)) {
        return res.status(400).json({ errors: ["Invalid phone format"] });
      }

      const phoneInUse = await User.findOne({ phone: newPhone });
      if (phoneInUse) {
        return res.status(400).send("Phone is already in use");
      }

      const currentTime = Date.now();

      if (profile.cooldownUntil) {
        if (Date.now() > profile.cooldownUntil) {
          profile.cooldownUntil = undefined;
          profile.codesSent.count = 1;
          await profile.save();
        }
      }

      if (profile.cooldownUntil && Date.now() < profile.cooldownUntil) {
        return res.send("Your requests are on cooldown");
      }

      if (profile.codesSent.count >= 3) {
        const cooldownTime = Date.now() + 180000;
        await User.updateOne(
          { _id: profile._id },
          { $set: { cooldownUntil: cooldownTime } }
        );
        res.json({ onCooldown: true });
      } else {
        profile.newPhone = newPhone;
        await sendCodeToPhone(profile, profile.newPhone);
        await profile.save();
        res.json({ success: true });
      }
    } catch (error) {
      console.error("Error during updating email:", error);
      res.status(500).send("Server error");
    }
  },

  async verifyAndUpdatePhone(req, res) {
    try {
      const { verificationCode } = req.body;
      const userId = req.user.userId;
      const profile = await User.findById(userId);
      const currentTime = Date.now();

      if (!profile) {
        return res.status(404).send("User not found");
      }

      if (!profile.newPhone) {
        return res.status(400).send("No pending phone update found");
      }

      if (currentTime > profile.verificationCodeExpiration) {
        return res.status(400).send("Verification code expired");
      }

      if (profile.verificationCode === verificationCode) {
        profile.phone = profile.newPhone;
        profile.newPhone = undefined;
        profile.lastPhoneUpdate = currentTime;
        profile.verificationCode = "";
        profile.verificationCodeExpiration = "";
        profile.codesSent.count = 1;
        await profile.save();
        res.json({ message: "Phone updated successfully" });
      } else {
        return res.status(400).send("Invalid verification code");
      }
    } catch (error) {
      console.error("Error during phone verification:", error);
      res.status(500).send("Server error");
    }
  },
};
