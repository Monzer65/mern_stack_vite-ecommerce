/** @format */
const express = require("express");
const app = express();
require("dotenv").config();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const PORT = process.env.PORT || 3000;
const mongodbURI = require("./config/databaseUriConfig");
const {
  connectToDatabase,
  waitForDatabaseConnection,
} = require("./controllers/databaseController");

connectToDatabase(mongodbURI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
    console.log("Connected to MongoDB Atlas");
  })
  .catch((err) => console.error("Error connecting to MongoDB Atlas:", err));

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

const adminRouter = require("./routes/admins");
app.use("/api/admin", waitForDatabaseConnection, adminRouter);

const authRouter = require("./routes/auth");
app.use("/api/auth", waitForDatabaseConnection, authRouter);

const cartRouter = require("./routes/carts");
app.use("/api/cart", waitForDatabaseConnection, cartRouter);

const categoryRouter = require("./routes/categories");
app.use("/api/categories", waitForDatabaseConnection, categoryRouter);

const productRouter = require("./routes/products");
app.use("/api/products", waitForDatabaseConnection, productRouter);

const profileRouter = require("./routes/profiles");
app.use("/api/profile", waitForDatabaseConnection, profileRouter);
