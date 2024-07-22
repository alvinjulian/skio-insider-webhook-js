const express = require('express');
const bodyParser = require('body-parser');
const Ajv = require('ajv');
require('dotenv').config();

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
app.post('/skio/webhook', (req, res) => {
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

    // Process the data as needed
    // console.log('Received data from Skio:', skioData);

    // Transform the data as needed
    // const insiderData = transformData(skioData);

    // Send the transformed data to Insider
    // const response = sendDataToInsider(insiderData);

    // Respond with success status
    // res.status(200).json({
    //     message: req
    // });

    return res.status(200).json({
        message: 'Success'
    });
});

app.get('/skio/webhook', (req, res) => {
    return res.status(200).send('Hello, Skio!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});