const express = require('express');
const bodyParser = require('body-parser');
const Ajv = require('ajv');
require('dotenv').config();
const axios = require('axios');

// Define the Insider API endpoint
const endpoint = 'https://unification.useinsider.com/api/user/v1/upsert';
// Define the partnerName
const partnerName = process.env.INSIDER_PARTNER_NAME;

// Define the request token
const requestToken = process.env.INSIDER_UCD_TOKEN;


// Import the functions from insider.js
const { sendDataToInsider, transformData } = require('./insider');

const app = express();

const PORT = process.env.PORT || 8000;

// Load the JSON schema provided by Skio
const skioSchema = require('./skioSchema.json'); // Assuming you save the schema in a file named skioSchema.json

// Initialize Ajv
const ajv = new Ajv();

// Middleware to parse JSON body
app.use(bodyParser.json());

// Route to handle webhook POST requests
app.post('/skio/webhook', async (req, res) => {
    // Verify that the request contains JSON data
    if (!req.is('application/json')) {
        return res.status(400).json({
            error: 'Invalid content type. Expected application/json.'
        });
    }

    // Parse the incoming JSON data
    const skioData = req.body;

    //Validate the skioWebhookToken
    if (skioData.skioWebhookToken !== process.env.SKIO_WEBHOOK_TOKEN) {
        return res.status(401).json({
            error: 'Unvalidated Token! Please check the Skio Webhook Token.'
        });
    }

    // Validate against the JSON schema provided by Skio
    // const valid = ajv.validate(skioSchema, skioData);
    // if (!valid) {
    //     return res.status(400).json({
    //         error: 'Invalid JSON data.'
    //     });
    // }

    // Transform the data as needed
    const insiderData = transformData(skioData.eventName, skioData.properties);

    const stringifiedData = JSON.stringify(insiderData);

    // console.log('Insider data:', JSON.stringify(insiderData));

    // Send the transformed data to Insider
    try {
        const response = await axios.post(endpoint,insiderData, {headers: {
            'Content-Type': 'application/json',
            'X-PARTNER-NAME': partnerName,
            'X-REQUEST-TOKEN': requestToken
        }})
        res.json(response.data);
    } catch (error) {
        console.error('Error calling the API:', error);
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            res.status(error.response.status).json({
                message: 'Error from the external API',
                details: JSON.stringify(error.response.data),
            });
        } else if (error.request) {
            // The request was made but no response was received
            res.status(500).json({
                message: 'No response received from the external API',
                details: error.request,
            });
        } else {
            // Something happened in setting up the request that triggered an Error
            res.status(500).json({
                message: 'Error setting up the request',
                details: error.message,
            });
        }
    }
});

app.get('/skio/webhook', (req, res) => {
    return res.status(200).send('Hello, Skio!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});