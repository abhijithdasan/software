// server/models/TravelEntry.js
const mongoose = require('mongoose');

const travelEntrySchema = new mongoose.Schema({
  agencyName: {
    type: String,
    required: true
  },
  customerName: String,
  destination: String,
  travelDate: Date,
  amount: Number,
  // Add other fields as needed
}, { timestamps: true });

module.exports = mongoose.model('TravelEntry', travelEntrySchema);