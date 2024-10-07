const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');

// Load client secrets from a local file.
const CREDENTIALS_PATH = './credentials.json';
const TOKEN_PATH = './token.json';

// Scopes determine what access the API has.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

// Authorize a client with credentials and call the provided callback.
function getNewToken(oAuth2Client, resolve, reject) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) {
                return reject(`Error retrieving access token: ${err}`);
            }

            oAuth2Client.setCredentials(token);

            // Store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) {
                    return reject(`Error saving the token: ${err}`);
                }
                console.log('Token stored to', TOKEN_PATH);
            });
            resolve(oAuth2Client);
        });
    });
}

// Authorize a client with credentials
function authorize() {
    return new Promise((resolve, reject) => {
        fs.readFile(CREDENTIALS_PATH, (err, content) => {
            if (err) return reject('Error loading client secret file:', err);

            const credentials = JSON.parse(content);
            if (!credentials.web) {
                return reject('Invalid credentials format. "web" property is missing.');
            }

            const { client_secret, client_id, redirect_uris } = credentials.web;
            const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

            // Check if we already have a token
            fs.readFile(TOKEN_PATH, (err, token) => {
                if (err) {
                    return getNewToken(oAuth2Client, resolve, reject);
                }
                oAuth2Client.setCredentials(JSON.parse(token));
                resolve(oAuth2Client);
            });
        });
    });
}

module.exports = {
    authorize
};
