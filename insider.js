const axios = require('axios');

// Define the endpoint URL
const endpoint = 'https://unification.useinsider.com/api/user/v1/upsert';

// Define the partnerName
const partnerName = 'PARTNER_NAME';

// Define the request token
const requestToken = 'REQUEST_TOKEN';

function sendDataToInsider(data) {

    try {
        axios.post(endpoint, {
            headers: {
                'Content-Type': 'application/json',
                'X-PARTNER-NAME': partnerName,
                'X-REQUEST-TOKEN': requestToken
            },
            data: data
        })
        .then((response) => {
            console.log('Insider response:', response.data);
            return response.data;
        })
    } catch (error) {
        // Handle error appropriately
        console.error('Error making POST request:', error.message);
        throw error;
    }
}

function transformData(_skioData) {
    let _skio = _skioData;
    let _insider = {};

}

module.exports = {
    sendDataToInsider,
    transformData
}