// models/Travel.js
const mongoose = require('mongoose');

const travelSchema = new mongoose.Schema({
  guestName: { type: String, required: true },
  startingKm: { type: Number, required: false,default: 0 },
  closingKm: { type: Number, required: false, default: 0 },
  startingTime: { type: String, required: false, },
  closingTime: { type: String, required: false },
  guestNumber: { type: String, required: true },
  tollFee: { type: Number, required: false, default: 0 },
  parkingFee: { type: Number, required: false, default: 0 },
  vehicleName: { type: String, required: true },
  vehicleNumber: { type: String, required: true },
  driverName: { type: String, required: true },
  reporting: { type: String, required: true },
  date: { type: Date, required: true },
  agency: { type: String, required: true },
  totalKm: { type: Number, required: false }, 
  totalHours: { type: Number, required: false },
  invoiceNumber: { type: String, required: true },
});


const Travel = mongoose.model('Travel', travelSchema);
module.exports = Travel;
