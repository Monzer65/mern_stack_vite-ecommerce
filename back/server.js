/** @format */
// server.js
require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser"); // Import the cookie-parser middleware
const app = express();
const PORT = process.env.PORT || 3000;
const mongodbURI = require("./config/databaseUriConfig");
const {
  connectToDatabase,
  waitForDatabaseConnection,
} = require("./controllers/databaseController");
const path = require("path");
const cors = require("cors");
// Register the middleware to be used for all routes
//or: app.all("/api/*", waitForDatabaseConnection) to apply  the middleware only to the routes that start with /api/

// Connect to MongoDB and start the server
connectToDatabase(mongodbURI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
    console.log("Connected to MongoDB Atlas");
  })
  .catch((err) => console.error("Error connecting to MongoDB Atlas:", err));

app.use(express.json());
app.use(cookieParser()); // Use the cookie-parser middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const productRouter = require("./routes/products");
app.use("/api/products", waitForDatabaseConnection, productRouter);

const cartRouter = require("./routes/carts");
app.use("/api/cart", waitForDatabaseConnection, cartRouter);

const authRouter = require("./routes/auth");
app.use("/api/auth", waitForDatabaseConnection, authRouter);

const profileRouter = require("./routes/profiles");
app.use("/api/profile", waitForDatabaseConnection, profileRouter);

const adminRouter = require("./routes/admins");
app.use("/api/admin", waitForDatabaseConnection, adminRouter);

const categoryRouter = require("./routes/categories");
app.use("/api/categories", waitForDatabaseConnection, categoryRouter);
