const express = require('express');
const TravelEntry = require('../models/Travel');
const Config = require('../models/Config');
const router = express.Router();

// Function to generate invoice number
const generateInvoiceNumber = (counter) => {
  return `STINV2025${counter.toString().padStart(4, '0')}`;
};

// Get current invoice number
router.get('/invoice/current', async (req, res) => {
  try {
    let config = await Config.findOne({ key: 'invoiceCounter' });

    if (!config) {
      config = new Config({ key: 'invoiceCounter', value: 1 });
      await config.save();
    }

    const currentInvoice = generateInvoiceNumber(config.value);
    res.status(200).json({ 
      currentNumber: config.value,
      formattedInvoice: currentInvoice 
    });
  } catch (error) {
    console.error('Error fetching current invoice:', error);
    res.status(500).json({ error: 'Failed to fetch invoice number' });
  }
});

// Get next invoice number and increment
router.post('/invoice/next', async (req, res) => {
  try {
    let config = await Config.findOne({ key: 'invoiceCounter' });
    
    if (!config) {
      config = new Config({ key: 'invoiceCounter', value: 1 });
    }
    
    const nextNumber = config.value + 1;
    config.value = nextNumber;
    await config.save();
    
    const formattedInvoice = generateInvoiceNumber(nextNumber);
    
    res.status(200).json({ 
      nextNumber,
      formattedInvoice
    });
  } catch (error) {
    console.error('Error generating next invoice:', error);
    res.status(500).json({ error: 'Failed to generate next invoice number' });
  }
});

// Endpoint for adding a travel entry
router.post('/', async (req, res) => {
  console.log('Received data:', req.body);
  try {
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
      tollFee,
      parkingFee,
      amount,
    } = req.body;

    if (
      !guestName || !startingKm || !closingKm || !startingTime || !closingTime ||
      !guestNumber || !vehicleName || !vehicleNumber || !driverName || !reporting ||
      !date || !agency || totalKm == null || !totalHours || !amount
    ) {
      return res.status(400).json({ error: 'All required fields must be filled' });
    }

    const config = await Config.findOneAndUpdate(
      { key: 'invoiceCounter' },
      { $inc: { value: 1 } },
      { new: true, upsert: true }
    );
    const invoiceNumber = generateInvoiceNumber(config.value);

    const newEntry = new TravelEntry({
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
      invoiceNumber,
      tollFee,
      parkingFee,
      amount,
    });

    await newEntry.save();

    res.status(201).json({ success: true, newEntry });
  } catch (error) {
    console.error('Error adding travel entry:', error.message || error);
    res.status(500).json({ error: 'Failed to create travel entry', details: error.message });
  }
});


// Endpoint to fetch all travel entries with optional agency filter
router.get('/', async (req, res) => {
  const { agency } = req.query;
  try {
    const filter = agency ? { agency } : {};
    const entries = await TravelEntry.find(filter);
    res.status(200).json(entries);
  } catch (error) {
    console.error('Error fetching travel entries:', error);
    res.status(500).json({ message: 'Failed to fetch travel entries' });
  }
});

// Endpoint to get daily sheet monitoring for cars used
router.get('/daily-sheet', async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const dailyEntries = await TravelEntry.find({
      date: { $gte: startOfDay, $lt: endOfDay },
    });

    res.status(200).json({ date: new Date().toLocaleDateString(), dailyEntries });
  } catch (error) {
    console.error('Error fetching daily sheet:', error);
    res.status(500).json({ message: 'Failed to fetch daily sheet' });
  }
});

module.exports = router;