// googleSheets.js
const fs = require('fs').promises;
const { google } = require('googleapis');

const CREDENTIALS_PATH = './credentials.json';
const TOKEN_PATH = './token.json';
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

// Mapping agency names to their Google Sheets IDs
const agencySheets = {
    "KTC": "1jubVN-3S6GS0FJJo1lwrAiK25jTvP17ulWeywx_OhlA",
    "Entrex": "1Rbx-FacC_lXjUU77t2Q4X6w5BgFA7AvBzZMu5DG5-Ho",
    "Jessy Cabs": "1ZKkwre9o2Z-T_RA_vR0-JEsLUQWTB48rxF_bZi-GsIg",
    "AB Travels": "1hVvLwYtxYc-vJPHiCLkUk_MivHz9q-ipqnOo3xBmiY0",
    "Arun Raja": "1F4KWeAScMx2d8TW9QLu2LHFMrAupiiyAVcJmJnVoRmM",
    "CBS": "150kkOFWsFWbk5oBINFKTrVAnzdPnQdO5_N5YyU2QF1w",
    "ETS": "1L9yDIpNZ45mVI8zyx-Mwxc7CXB-Vn9Onsd1SRQomrYs",
    "Rayappan": "1fMeJiR7v7-fjGxHKWWQMQbroxj_039jZsOzUyBe6zOY",
    "Serene": "1aif3SGNvu85pzezt7IG4H0oLRBFHQXDhwNCz6RNiQ80",
    "Soorya": "1MTD6UC0P9AqCBBnynmGK1gN05HdJxyhVdury62ioYG8",
    "Sujith": "1Y_zFHCm64DrJHXfbkYUgYb1iHWK-xqZeNpUIgcLEu30",
    "WLT Jakku": "13lJoTB1hfyRDqwr7bxgrH6qU99L6IikRNl8JqwYcZG8",
    "Other": "1n8b5coU3mYbIbvdLKdRtsrQjMcKk5hWimmVjKasxQjo"
};

let oAuth2Client = null;

async function authorize() {
    try {
        if (oAuth2Client) {
            return oAuth2Client;
        }

        const content = await fs.readFile(CREDENTIALS_PATH);
        const credentials = JSON.parse(content);
        const { client_secret, client_id, redirect_uris } = credentials.web;
        
        oAuth2Client = new google.auth.OAuth2(
            client_id,
            client_secret,
            redirect_uris[0]
        );

        try {
            const token = await fs.readFile(TOKEN_PATH);
            oAuth2Client.setCredentials(JSON.parse(token));
            return oAuth2Client;
        } catch (err) {
            // Token doesn't exist or is invalid
            return oAuth2Client;
        }
    } catch (error) {
        throw new Error('Error loading client secret file: ' + error);
    }
}

async function saveToken(token) {
    try {
        await fs.writeFile(TOKEN_PATH, JSON.stringify(token));
        console.log('Token stored to', TOKEN_PATH);
    } catch (err) {
        console.error('Error saving token:', err);
        throw err;
    }
}

async function getOrCreateMonthlyTab(sheets, spreadsheetId, month) {
    try {
        const response = await sheets.spreadsheets.get({ spreadsheetId });
        const monthTabExists = response.data.sheets.some(sheet => 
            sheet.properties.title === month
        );
        
        if (!monthTabExists) {
            await sheets.spreadsheets.batchUpdate({
                spreadsheetId,
                resource: {
                    requests: [{
                        addSheet: {
                            properties: { title: month }
                        }
                    }]
                }
            });
            console.log(`Created new tab for month: ${month} in spreadsheet: ${spreadsheetId}`);
        }
    } catch (error) {
        console.error('Error in getOrCreateMonthlyTab:', error);
        throw error;
    }
}

async function appendDataToAgencySheet(auth, agencyName, data) {
    try {
        if (!agencySheets[agencyName]) {
            throw new Error(`No spreadsheet ID found for agency: ${agencyName}`);
        }

        const sheets = google.sheets({ version: 'v4', auth });
        const spreadsheetId = agencySheets[agencyName];
        const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

        await getOrCreateMonthlyTab(sheets, spreadsheetId, currentMonth);

        const result = await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: `${currentMonth}!A1`,
            valueInputOption: 'RAW',
            resource: { values: [data] }
        });

        console.log(`Data appended to ${agencyName}'s sheet for ${currentMonth}`);
        return result;
    } catch (error) {
        console.error('Error in appendDataToAgencySheet:', error);
        throw error;
    }
}

module.exports = {
    authorize,
    appendDataToAgencySheet,
    agencySheets,
    saveToken
};