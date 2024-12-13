const mongoose = require('mongoose');

const travelSchema = new mongoose.Schema({
  guestName: { type: String, required: true },
  startingKm: { type: Number, required: true },
  closingKm: { type: Number, required: true },
  startingTime: { type: String, required: true },
  closingTime: { type: String, required: true },
  guestNumber: { type: String, required: true },
  tollFee: { type: Number, default: 0 },
  parkingFee: { type: Number, default: 0 },
  amount: { type: Number, default: 0 }, 
  vehicleName: { type: String, required: true },
  vehicleNumber: { type: String, required: true },
  driverName: { type: String, required: true },
  reporting: { type: String, required: true },
  date: { type: Date, required: true },
  agency: { type: String, required: true },
  totalKm: { type: Number, required: true },
  totalHours: {
    type: String, 
    required: true,
    validate: {
      validator: function(value) {
        return /^(\d{2}):(\d{2})$/.test(value); 
      },
      message: props => `${props.value} is not a valid time format!`
    }
  },
  invoiceNumber: { type: String, unique: true },
});

module.exports = mongoose.model('TravelEntry', travelSchema);
