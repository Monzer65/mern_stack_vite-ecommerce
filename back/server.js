/** @format */
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
require("dotenv").config();
const PORT = process.env.PORT || 3000;
const mongodbURI = require("./config/databaseUriConfig");
const {
  connectToDatabase,
  waitForDatabaseConnection,
} = require("./controllers/databaseController");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const path = require("path");

connectToDatabase(mongodbURI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
    console.log("Connected to MongoDB Atlas");
  })
  .catch((err) => console.error("Error connecting to MongoDB Atlas:", err));

app.use(express.json());
app.use(cookieParser());
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
