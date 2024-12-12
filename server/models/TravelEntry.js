const mongoose = require('mongoose');

// Define the TravelEntry Schema
const travelEntrySchema = new mongoose.Schema({
  agencyName: {
    type: String,
    required: true
  },
  guestName: String,
  guestNumber: String,
  vehicleNumber: String,
  invoiceNumber: String,
  travelDate: {
    type: Date,
    required: true
  },
  reporting: String, 
  startingTime: String, 
  closingTime: String, 
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
  startingKm: {
    type: Number,
    required: true
  },
  closingKm: {
    type: Number,
    required: true
  },
  totalKm: {
    type: Number,
    required: true
  },
  parkingFee: {
    type: Number,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
}, { timestamps: true });

// Export the model
module.exports = mongoose.model('TravelEntry', travelEntrySchema);
