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

    // Map the fields from Skio to Insider
    let iEventName = eventNameConverter(_skio.eventType);
    let iEventTimestamp = _skio.eventData.timestamp;
    let iEmail = _skio.eventData.userEmail;

    // Map the event data fields
    _insider = {
        "skip_hook": false,
        "users": [{
            "identifiers": {
                "email": iEmail,
            },
            "events": [
                {
                    "event_name": iEventName,
                    "timestamp": iEventTimestamp,
                    // If you have event parameters, you can uncomment this section and use this as the template
                    // "event_params": {
                    //     "custom": {
                    //     }
                    // }
                }
            ]
        }]
    }
}

function eventNameConverter(_eventName) {
    // Convert the event name from Skio to Insider
    if (_eventName === 'Discount code applied') {
        // Change the event name based on your event name in Insider
        return 'apply_discount_code';
    } else if (_eventName === 'Subscription activated') {
        return 'subscription_activated';
    } else if (_eventName === 'Subscription cancelled') {
        return 'subscription_cancelled';
    } else if (_eventName === 'orderPlaced') {
        return 'order_placed';
    } else if (_eventName === 'productsUpdated') {
        return 'products_updated';
    } else {
        return _eventName;
    }
}

module.exports = {
    sendDataToInsider,
    transformData
}