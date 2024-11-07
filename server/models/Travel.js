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
  amount: { type: Number, required: true },  // Make this required if the amount is necessary
  vehicleName: { type: String, required: true },
  vehicleNumber: { type: String, required: true },
  driverName: { type: String, required: true },
  reporting: { type: String, required: true },
  date: { type: Date, required: true },
  agency: { type: String, required: true },
  totalKm: { type: Number, required: true },  // If totalKm is essential, mark it required
  totalHours: {
    type: String,  // Store the time in HH:MM format as a string
    required: true,
    validate: {
      validator: function(value) {
        return /^(\d{2}):(\d{2})$/.test(value);  // Validate time format "HH:MM"
      },
      message: props => `${props.value} is not a valid time format!`
    }
  },
  invoiceNumber: { type: String, required: true },
});

module.exports = mongoose.model('TravelEntry', travelSchema);
