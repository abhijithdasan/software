const express = require('express');
const bodyParser = require('body-parser');
const { authorize, createDailySheet, appendDataToDailySheet } = require('./googleSheets');

const app = express();
const PORT = 3000; // Use uppercase as a convention for constants

app.use(bodyParser.json()); // Middleware for parsing JSON bodies

// Route to add daily data
app.post('/addDailyData', async (req, res) => {
    try {
        const auth = await authorize();
        await createDailySheet(auth);
        await appendDataToDailySheet(auth, req.body.data); // Assuming data is sent in the request body
        res.status(200).send('Data added successfully!');
    } catch (error) {
        console.error('Error adding data:', error);
        res.status(500).send('Error adding data');
    }
});

// Basic route to check if server is running
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// OAuth callback route
// OAuth callback route
app.get('/auth/google/callback', async (req, res) => {
    const { code } = req.query; // Get the code from the query parameters
    if (!code) {
        return res.status(400).send('No code found');
    }

    try {
        const auth = await authorize(); // Make sure to call your authorize method correctly
        // Exchange the authorization code for tokens
        const { tokens } = await auth.getToken(code);
        auth.setCredentials(tokens); // Set the tokens on the auth object
        res.send('Google OAuth authentication successful! Tokens: ' + JSON.stringify(tokens));
    } catch (error) {
        console.error('Error exchanging code for token:', error);
        res.status(500).send('Error during token exchange');
    }
});


// Start the server using the correct variable name
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
