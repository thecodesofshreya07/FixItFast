const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  Booking_Id: Number,
  Booking_date: Date,
  Booking_Status: String,

  Customer_Id: {
    type: Number
  },

  Professional_Id: {
    type: Number
  }
});

module.exports = mongoose.model("Booking", bookingSchema);