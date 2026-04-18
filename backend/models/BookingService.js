const mongoose = require("mongoose");

const bookingServiceSchema = new mongoose.Schema({
  Booking_Id: Number,
  Service_Id: Number
});

module.exports = mongoose.model("BookingService", bookingServiceSchema);