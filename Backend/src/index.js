const express = require("express");
const { PORT } = require("../constant/constant");
const { connectDB } = require("./config/db");
const apiDB = require("../routes/initializeDb"); // Assuming your routes are in this file
const transactionRoutes = require("../routes/producttransaction");
const productapi = require("../routes/products");
const cors = require("cors");
const app = express();

// Middleware to parse JSON bodies
app.use(cors());

app.use(express.json());

// Connect to the database and start the server
connectDB()
  .then(() => {
    console.log("Database connection established successfully");

    // Register the API routes
    app.use("/api", apiDB); // Correctly use the apiDB routes
    app.use("/api/transactions", transactionRoutes);
    app.use("/api/transaction", productapi);

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is Running on Port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err.message);
  });
