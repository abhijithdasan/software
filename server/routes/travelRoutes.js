// routes/travelRoutes.js
const express = require('express');
const TravelEntry = require('../models/Travel'); // Ensure this path is correct
const router = express.Router();

// Endpoint for adding a travel entry
router.post('/', async (req, res) => {
  console.log('Received data:', req.body); // Debugging line to log received data
  try {
    // Validate that all required fields are present
    const {
      guestName,
      startingKm,
      closingKm,
      startingTime,
      closingTime,
      guestNumber,
      vehicleName,
      vehicleNumber,
      driverName,
      reporting,
      date,
      agency,
      totalKm,
      totalHours,
      invoiceNumber
    } = req.body;

    if (!guestName || !guestNumber || !vehicleName || !vehicleNumber ||
        !driverName || !reporting || !date || !agency || !invoiceNumber ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const travelEntry = new TravelEntry(req.body);
    await travelEntry.save();
    res.status(201).json(travelEntry);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all travel entries with optional agency filter
router.get('/', async (req, res) => {
  const { agency } = req.query; // Allow filtering by agency name
  try {
    const filter = agency ? { agency } : {};
    const entries = await TravelEntry.find(filter);
    res.status(200).json(entries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Daily sheet monitoring for cars used
router.get('/daily-sheet', async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const dailyEntries = await TravelEntry.find({
      date: { $gte: startOfDay, $lt: endOfDay }
    });

    // Assuming each entry represents a single car usage, we can count entries
    const totalCarsUsed = dailyEntries.length;

    res.status(200).json({ date: new Date().toLocaleDateString(), totalCarsUsed });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
