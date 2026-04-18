const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  Service_Id: Number,
  Service_type: String,
  Service_charge: Number
});

module.exports = mongoose.model("Service", serviceSchema);