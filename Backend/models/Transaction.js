const mongoose = require("mongoose");

const { Schema } = mongoose;

const transactionSchema = new Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  sold: { type: Boolean, default: false },
  dateOfSale: { type: Date },
});

const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;
