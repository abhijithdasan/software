const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Example endpoint for form submission
app.post('/api/submit', (req, res) => {
  const data = req.body;
  console.log('Received form data:', data);

  // Here, you can add code to save data to MongoDB or Google Sheets
  // For example: db.collection('entries').insertOne(data);

  res.send({ status: 'success', message: 'Data saved successfully' });
});

app.listen(5000, () => {
  console.log('Server running on https://care-sixten.onrender.com/');
});
