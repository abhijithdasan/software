// server/models/TravelEntry.js
const mongoose = require('mongoose');

const travelEntrySchema = new mongoose.Schema({
  agencyName: {
    type: String,
    required: true
  },
  guestName: String,
  guestNumber: String,
  vehicleNumber: String,
  invoiceNumber: String,
  travelDate: Date,
  reporting: String, 
  startingTime: String, 
  closingTime: String, 
  totalHours: String, 
  startingKm: Number,
  closingKm: Number,
  totalKm: Number,
  parkingFee: Number,
}, { timestamps: true });

module.exports = mongoose.model('TravelEntry', travelEntrySchema);
