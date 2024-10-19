const mongoose = require("mongoose");
const { DB_URL } = require("../../constant/constant");

const connectDB = async () => {
  await mongoose.connect(DB_URL);
};

module.exports = { connectDB };
