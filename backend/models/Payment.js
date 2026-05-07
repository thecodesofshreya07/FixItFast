const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  Payment_Id: Number,
  Amount: Number,
  Payment_mode: String,
  Payment_date: Date,
  Booking_Id: Number,
  Payment_status: { type: String, default: "Paid" }
});

module.exports = mongoose.model("Payment", paymentSchema);