const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  Payment_Id: Number,
  Amount: Number,
  Payment_mode: String,
  Payment_date: Date,
  Booking_Id: Number
});

module.exports = mongoose.model("Payment", paymentSchema);