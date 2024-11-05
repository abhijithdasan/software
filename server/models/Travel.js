// models/Travel.js
const mongoose = require('mongoose');

const travelSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', // Reference to the User model
  },
  destination: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  notes: {
    type: String,
    required: false,
  },
});

const Travel = mongoose.model('Travel', travelSchema);
module.exports = Travel;
