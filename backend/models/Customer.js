const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  Customer_Id: Number,
  Customer_name: String,
  Address: String,
  contact: String,
  Password: String
});

module.exports = mongoose.model("Customer", customerSchema);