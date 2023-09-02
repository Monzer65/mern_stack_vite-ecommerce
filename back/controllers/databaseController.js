/** @format */

const mongoose = require("mongoose");

// Middleware to check if the database connection is established
const waitForDatabaseConnection = (req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next();
  } else {
    res.status(500).json({ error: error.message });
  }
};

const connectToDatabase = (MONGODB_URI) => {
  return mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

// If Node.js process is terminated, close the MongoDB connection
process.on("SIGINT", async () => {
  try {
    await mongoose.connection.close();
    console.log(
      "Mongoose default connection is disconnected due to application termination"
    );
    process.exit(0);
  } catch (err) {
    console.error("Error closing MongoDB connection:", err);
    process.exit(1);
  }
});

module.exports = { waitForDatabaseConnection, connectToDatabase };
