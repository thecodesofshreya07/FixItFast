const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  Customer_Id: Number,

  Customer_name: {
    type: String,
    required: true,
  },

  // Contact: {
  //   type: String,
  //   required: true,
  // },

  Email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },

  Password: {
    type: String,
    required: true,
  },

  Address: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model(
  "Customer",
  customerSchema,
  "customers"
);