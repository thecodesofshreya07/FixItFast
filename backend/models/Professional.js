const mongoose = require("mongoose");

const professionalSchema = new mongoose.Schema({
  Professional_Id: Number,
  Professional_name: String,
  Skill: String,
  Contact: String,
  Service_Id: Number,
  Rating: Number
});
module.exports = mongoose.model(
  "Professional",
  professionalSchema,
  "professionals" // 👈 FORCE correct collection
);