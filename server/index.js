const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');
require('dotenv').config();

const app = express();
const port = 5000; // You can change this port if needed

// Middleware
app.use(cors());
app.use(express.json());

// Google OAuth configuration
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// Route to initiate OAuth flow
app.get('/auth/google', (req, res) => {
    const url = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/documents'],
    });
    res.redirect(url);
});

// Callback route
app.get('/auth/google/callback', async (req, res) => {
    const { code } = req.query;
    try {
        const { tokens } = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokens);
        res.status(200).json({ message: 'Authentication successful!', tokens });
    } catch (error) {
        res.status(400).json({ error: 'Error retrieving access token.' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
