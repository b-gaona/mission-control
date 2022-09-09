const mongoose = require("mongoose");

const launchesSchema = new mongoose.Schema({
  flightNumber: {
    type: Number,
    required: true,
  },
  mission: {
    type: String,
    required: true,
  },
  rocket: {
    type: String,
    required: true,
  },
  launchDate: {
    type: Date,
    required: true,
  },
  target: {
    type: String,
    required: false, // Because the Space X API doesn't have a target
  },
  customers: [String],
  upcoming: {
    type: Boolean,
    default: true,
    required: true,
  },
  success: {
    type: Boolean,
    default: true,
    required: true,
  },
});

//Connects launchesSchema with the "launches" collection
module.exports = mongoose.model("Launch", launchesSchema); //The launchesSchema is assigned to the Launch model
