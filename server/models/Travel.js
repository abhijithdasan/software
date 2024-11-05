// models/Travel.js
const mongoose = require('mongoose');

const travelSchema = new mongoose.Schema({
  guestName: { type: String, required: true },
  startingKm: { type: Number, required: true },
  closingKm: { type: Number, required: true },
  startingTime: { type: String, required: true },
  closingTime: { type: String, required: true },
  guestNumber: { type: String, required: true },
  tollFee: { type: Number, required: false, default: 0 },
  parkingFee: { type: Number, required: false, default: 0 },
  vehicleName: { type: String, required: true },
  vehicleNumber: { type: String, required: true },
  driverName: { type: String, required: true },
  reporting: { type: String, required: true },
  date: { type: Date, required: true },
  agency: { type: String, required: true },
  totalKm: { type: Number, required: true },
  totalHours: { type: Number, required: true },
  invoiceNumber: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});


const Travel = mongoose.model('Travel', travelSchema);
module.exports = Travel;
