  // routes/travelRoutes.js
  const express = require('express');
  const Travel = require('../models/Travel'); // Ensure this path is correct
  const router = express.Router();

  // Example endpoint for adding a travel entry
  router.post('/', async (req, res) => {
    try {
      const travelEntry = new Travel(req.body);
      await travelEntry.save();
      res.status(201).json(travelEntry);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // Example endpoint for fetching all travel entries
  router.get('/', async (req, res) => {
    try {
      const travelEntries = await Travel.find();
      res.status(200).json(travelEntries);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  module.exports = router;
