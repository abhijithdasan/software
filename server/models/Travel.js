const mongoose = require('mongoose');

const travelSchema = new mongoose.Schema({
  guestName: { type: String, required: true },
  startingKm: { type: Number, required: true },
  closingKm: { type: Number, required: true },
  startingTime: { type: String, required: true },
  closingTime: { type: String, required: true },
  guestNumber: { type: String, required: true },
  tollFee: { type: Number },
  parkingFee: { type: Number },
  vehicleName: { type: String, required: true },
  vehicleNumber: { type: String, required: true },
  driverName: { type: String, required: true },
  reporting: { type: String, required: true },
  date: { type: Date, required: true },
  agency: { type: String, required: true },
  totalKm: { type: Number },
  totalHours: { type: Number },
  invoiceNumber: { type: String, required: true },
});

module.exports = mongoose.model('TravelEntry', travelSchema);
