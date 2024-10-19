const mongoose = require("mongoose");
const express = require("express");
const axios = require("axios");
const Transaction = require("../models/Transaction");

const router = express.Router();

router.post("/initialize", async (req, res) => {
  try {
    const response = await axios.get(
      "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
    );

    const transactionData = response.data;
    console.log(transactionData);

    await Transaction.deleteMany({});

    await Transaction.insertMany(transactionData);

    res.status(200).json({
      message: "Data seeded successfully",
    });
  } catch (error) {
    console.error("Error occurred:", error.message);

    res.status(500).json({
      message: "Error initializing database",
      error: error.message,
    });
  }
});

module.exports = router;
