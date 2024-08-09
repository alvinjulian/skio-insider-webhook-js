const axios = require('axios');
const moment = require('moment');

// Define the endpoint URL
const endpoint = 'https://unification.useinsider.com/api/user/v1/upsert';

// Define the partnerName
const partnerName = process.env.INSIDER_PARTNER_NAME;

// Define the request token
const requestToken = process.env.INSIDER_UCD_TOKEN;

function sendDataToInsider(_data) {
    // try {
        axios.post(endpoint, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-PARTNER-NAME': partnerName,
                    'X-REQUEST-TOKEN': requestToken
                },
                data: _data
            })
            .then((response) => {
                // Handle response appropriately
                console.log(response.status)
                return response.status;
            })
            .then((error) => {
                // Handle error appropriately
                return error.response.status
                // throw error;
            })
    // } catch (error) {
    //     // Handle error appropriately
    //     console.log('Error:', error.status);
    //     // throw error;
    // }
}

function transformData(eventName, eventProperties) {
    // Map the fields from Skio to Insider
    let insEventName = eventNameConverter(eventName);
    let insTimestamp = moment(new Date()).utc().toISOString();
    let insEmail = eventProperties.email ? eventProperties.email : '';
    let insPhoneNumber = eventProperties.phone ? eventProperties.phone : null;

    // Check the event name and transform the data accordingly
    if(insEventName === 'skio_billing_attempt_failed') {
        return {
            "skip_hook": false,
            "users": [{
                "identifiers": {
                    "email": insEmail,
                    "phone_number": insPhoneNumber
                },
                "attributes": {
                    "skio_subscription_id": eventProperties.subscriptionId,
                    "skio_subscription_status": eventProperties.status,
                    "skio_delivery_price": eventProperties.deliveryPrice,
                    "skio_cancelled_at": eventProperties.cancelledAt,
                    "skio_next_billing_at": eventProperties.nextBillingAt,
                    "skio_billing_interval": eventProperties.billingInterval,
                    "skio_billing_interval_count": eventProperties.intervalCount,
                    "skio_manage_subscription_url": eventProperties.manageSubscriptionUrl,
                    "skio_is_prepaid": eventProperties.isPrepaid,
                    "skio_qa_token": eventProperties.qaToken,
                    "skio_subscription_lines": JSON.stringify(eventProperties.subscriptionLines),
                    "skio_box_subscription_lines": JSON.stringify(eventProperties.boxSubscriptionLines),
                    "skio_currency_code": eventProperties.currencyCode,
                    "skio_currency_symbol": eventProperties.currencySymbol,
                    "skio_total_subscription_price": eventProperties.total,
                    "skio_has_surprise_discount": eventProperties.hasSurpriseDiscount,
                    "skio_has_surprise_product": eventProperties.hasSurpriseProduct,

                    // Skio Address Fields
                    "skio_address_first_line": eventProperties.shippingAddress.address1,
                    "skio_address_second_line": eventProperties.shippingAddress.address2,
                    "skio_address_city": eventProperties.shippingAddress.city,
                    "skio_address_country": eventProperties.shippingAddress.country,
                    "skio_address_province": eventProperties.shippingAddress.province,
                    "skio_address_zip": eventProperties.shippingAddress.zip,
                },
                "events": [
                    {
                        "event_name": insEventName,
                        "timestamp": insTimestamp,
                        "event_params": {
                            "custom": {
                                "error_message": eventProperties.errorMessage,
                                "error_code": eventProperties.errorCode,
                                "number_of_attempts": eventProperties.numberOfFailedAttempts
                            }
                        }
                    }
                ]
            }]
        }
    } else if(insEventName === 'skio_card_will_expire') {
        return {
            "skip_hook": false,
            "users": [{
                "identifiers": {
                    "email": insEmail,
                    "phone_number": insPhoneNumber
                },
                "attributes": {
                    "skio_subscription_id": eventProperties.subscriptionId,
                    "skio_subscription_status": eventProperties.status,
                    "skio_delivery_price": eventProperties.deliveryPrice,
                    "skio_cancelled_at": eventProperties.cancelledAt,
                    "skio_next_billing_at": eventProperties.nextBillingAt,
                    "skio_billing_interval": eventProperties.billingInterval,
                    "skio_billing_interval_count": eventProperties.intervalCount,
                    "skio_manage_subscription_url": eventProperties.manageSubscriptionUrl,
                    "skio_is_prepaid": eventProperties.isPrepaid,
                    "skio_qa_token": eventProperties.qaToken,
                    "skio_subscription_lines": JSON.stringify(eventProperties.subscriptionLines),
                    "skio_box_subscription_lines": JSON.stringify(eventProperties.boxSubscriptionLines),
                    "skio_currency_code": eventProperties.currencyCode,
                    "skio_currency_symbol": eventProperties.currencySymbol,
                    "skio_total_subscription_price": eventProperties.total,
                    "skio_has_surprise_discount": eventProperties.hasSurpriseDiscount,
                    "skio_has_surprise_product": eventProperties.hasSurpriseProduct,

                    // Skio Address Fields
                    "skio_address_first_line": eventProperties.shippingAddress.address1,
                    "skio_address_second_line": eventProperties.shippingAddress.address2,
                    "skio_address_city": eventProperties.shippingAddress.city,
                    "skio_address_country": eventProperties.shippingAddress.country,
                    "skio_address_province": eventProperties.shippingAddress.province,
                    "skio_address_zip": eventProperties.shippingAddress.zip,
                },
                "events": [
                    {
                        "event_name": insEventName,
                        "timestamp": insTimestamp,
                        "event_params": {
                            "custom": {
                                "last_four_digits": eventProperties.paymentMethodLastDigits,
                                "days_until_expiry": eventProperties.daysUntilExpiration
                            }
                        }
                    }
                ]
            }]
        }
    } else if(insEventName === 'skio_oos_missing_billing_back_in_stock') {
        return {
            "skip_hook": false,
            "users": [{
                "identifiers": {
                    "email": insEmail,
                    "phone_number": insPhoneNumber
                },
                "attributes": {
                    "skio_subscription_id": eventProperties.subscriptionId,
                    "skio_subscription_status": eventProperties.status,
                    "skio_delivery_price": eventProperties.deliveryPrice,
                    "skio_cancelled_at": eventProperties.cancelledAt,
                    "skio_next_billing_at": eventProperties.nextBillingAt,
                    "skio_billing_interval": eventProperties.billingInterval,
                    "skio_billing_interval_count": eventProperties.intervalCount,
                    "skio_manage_subscription_url": eventProperties.manageSubscriptionUrl,
                    "skio_is_prepaid": eventProperties.isPrepaid,
                    "skio_qa_token": eventProperties.qaToken,
                    "skio_subscription_lines": JSON.stringify(eventProperties.subscriptionLines),
                    "skio_box_subscription_lines": JSON.stringify(eventProperties.boxSubscriptionLines),
                    "skio_currency_code": eventProperties.currencyCode,
                    "skio_currency_symbol": eventProperties.currencySymbol,
                    "skio_total_subscription_price": eventProperties.total,
                    "skio_has_surprise_discount": eventProperties.hasSurpriseDiscount,
                    "skio_has_surprise_product": eventProperties.hasSurpriseProduct,

                    // Skio Address Fields
                    "skio_address_first_line": eventProperties.shippingAddress.address1,
                    "skio_address_second_line": eventProperties.shippingAddress.address2,
                    "skio_address_city": eventProperties.shippingAddress.city,
                    "skio_address_country": eventProperties.shippingAddress.country,
                    "skio_address_province": eventProperties.shippingAddress.province,
                    "skio_address_zip": eventProperties.shippingAddress.zip,
                },
                "events": [
                    {
                        "event_name": insEventName,
                        "timestamp": insTimestamp,
                        "event_params": {
                            "custom": {
                                "back_in_stock": JSON.stringify(eventProperties.backInStockItems)
                            }
                        }
                    }
                ]
            }]
        }
    
    } else if(insEventName === 'skio_prepaid_gift_received') {
        return {
            "skip_hook": false,
            "users": [{
                "identifiers": {
                    "email": insEmail,
                    "phone_number": insPhoneNumber
                },
                "attributes": {
                    "skio_subscription_id": eventProperties.subscriptionId,
                    "skio_subscription_status": eventProperties.status,
                    "skio_delivery_price": eventProperties.deliveryPrice,
                    "skio_cancelled_at": eventProperties.cancelledAt,
                    "skio_next_billing_at": eventProperties.nextBillingAt,
                    "skio_billing_interval": eventProperties.billingInterval,
                    "skio_billing_interval_count": eventProperties.intervalCount,
                    "skio_manage_subscription_url": eventProperties.manageSubscriptionUrl,
                    "skio_is_prepaid": eventProperties.isPrepaid,
                    "skio_qa_token": eventProperties.qaToken,
                    "skio_subscription_lines": JSON.stringify(eventProperties.subscriptionLines),
                    "skio_box_subscription_lines": JSON.stringify(eventProperties.boxSubscriptionLines),
                    "skio_currency_code": eventProperties.currencyCode,
                    "skio_currency_symbol": eventProperties.currencySymbol,
                    "skio_total_subscription_price": eventProperties.total,
                    "skio_has_surprise_discount": eventProperties.hasSurpriseDiscount,
                    "skio_has_surprise_product": eventProperties.hasSurpriseProduct,

                    // Skio Address Fields
                    "skio_address_first_line": eventProperties.shippingAddress.address1,
                    "skio_address_second_line": eventProperties.shippingAddress.address2,
                    "skio_address_city": eventProperties.shippingAddress.city,
                    "skio_address_country": eventProperties.shippingAddress.country,
                    "skio_address_province": eventProperties.shippingAddress.province,
                    "skio_address_zip": eventProperties.shippingAddress.zip,
                },
                "events": [
                    {
                        "event_name": insEventName,
                        "timestamp": insTimestamp,
                        "event_params": {
                            "custom": {
                                "skio_is_prepaid_gift": eventProperties.isPrepaidGift,
                                "skio_prepaid_gift_message": eventProperties.prepaidGiftMessage,
                            }
                        }
                    }
                ]
            }]
        }
    
    } else if(insEventName === 'skio_subscription_auto_merged') {
        return {
            "skip_hook": false,
            "users": [{
                "identifiers": {
                    "email": insEmail,
                    "phone_number": insPhoneNumber
                },
                "attributes": {
                    "skio_subscription_id": eventProperties.subscriptionId,
                    "skio_subscription_status": eventProperties.status,
                    "skio_delivery_price": eventProperties.deliveryPrice,
                    "skio_cancelled_at": eventProperties.cancelledAt,
                    "skio_next_billing_at": eventProperties.nextBillingAt,
                    "skio_billing_interval": eventProperties.billingInterval,
                    "skio_billing_interval_count": eventProperties.intervalCount,
                    "skio_manage_subscription_url": eventProperties.manageSubscriptionUrl,
                    "skio_is_prepaid": eventProperties.isPrepaid,
                    "skio_qa_token": eventProperties.qaToken,
                    "skio_subscription_lines": JSON.stringify(eventProperties.subscriptionLines),
                    "skio_box_subscription_lines": JSON.stringify(eventProperties.boxSubscriptionLines),
                    "skio_currency_code": eventProperties.currencyCode,
                    "skio_currency_symbol": eventProperties.currencySymbol,
                    "skio_total_subscription_price": eventProperties.total,
                    "skio_has_surprise_discount": eventProperties.hasSurpriseDiscount,
                    "skio_has_surprise_product": eventProperties.hasSurpriseProduct,

                    // Skio Address Fields
                    "skio_address_first_line": eventProperties.shippingAddress.address1,
                    "skio_address_second_line": eventProperties.shippingAddress.address2,
                    "skio_address_city": eventProperties.shippingAddress.city,
                    "skio_address_country": eventProperties.shippingAddress.country,
                    "skio_address_province": eventProperties.shippingAddress.province,
                    "skio_address_zip": eventProperties.shippingAddress.zip,
                },
                "events": [
                    {
                        "event_name": insEventName,
                        "timestamp": insTimestamp,
                    }
                ]
            }]
        }
    } else if(insEventName === 'skio_subscription_cancelled') {
        return {
            "skip_hook": false,
            "users": [{
                "identifiers": {
                    "email": insEmail,
                    "phone_number": insPhoneNumber
                },
                "attributes": {
                    "skio_subscription_id": eventProperties.subscriptionId,
                    "skio_subscription_status": eventProperties.status,
                    "skio_delivery_price": eventProperties.deliveryPrice,
                    "skio_cancelled_at": eventProperties.cancelledAt,
                    "skio_next_billing_at": eventProperties.nextBillingAt,
                    "skio_billing_interval": eventProperties.billingInterval,
                    "skio_billing_interval_count": eventProperties.intervalCount,
                    "skio_manage_subscription_url": eventProperties.manageSubscriptionUrl,
                    "skio_is_prepaid": eventProperties.isPrepaid,
                    "skio_qa_token": eventProperties.qaToken,
                    "skio_subscription_lines": JSON.stringify(eventProperties.subscriptionLines),
                    "skio_box_subscription_lines": JSON.stringify(eventProperties.boxSubscriptionLines),
                    "skio_currency_code": eventProperties.currencyCode,
                    "skio_currency_symbol": eventProperties.currencySymbol,
                    "skio_total_subscription_price": eventProperties.total,
                    "skio_has_surprise_discount": eventProperties.hasSurpriseDiscount,
                    "skio_has_surprise_product": eventProperties.hasSurpriseProduct,

                    // Skio Address Fields
                    "skio_address_first_line": eventProperties.shippingAddress.address1,
                    "skio_address_second_line": eventProperties.shippingAddress.address2,
                    "skio_address_city": eventProperties.shippingAddress.city,
                    "skio_address_country": eventProperties.shippingAddress.country,
                    "skio_address_province": eventProperties.shippingAddress.province,
                    "skio_address_zip": eventProperties.shippingAddress.zip,
                },
                "events": [
                    {
                        "event_name": insEventName,
                        "timestamp": insTimestamp,
                        "event_params": {
                            "custom": {
                                "skio_cancellation_reason": eventProperties.cancellationReason,
                            }
                        }
                    }
                ]
            }]
        }
    } else if(insEventName === 'skio_subscription_created') {
        return {
            "skip_hook": false,
            "users": [{
                "identifiers": {
                    "email": insEmail,
                    "phone_number": insPhoneNumber
                },
                "attributes": {
                    "skio_subscription_id": eventProperties.subscriptionId,
                    "skio_subscription_status": eventProperties.status,
                    "skio_delivery_price": eventProperties.deliveryPrice,
                    "skio_cancelled_at": eventProperties.cancelledAt,
                    "skio_next_billing_at": eventProperties.nextBillingAt,
                    "skio_billing_interval": eventProperties.billingInterval,
                    "skio_billing_interval_count": eventProperties.intervalCount,
                    "skio_manage_subscription_url": eventProperties.manageSubscriptionUrl,
                    "skio_is_prepaid": eventProperties.isPrepaid,
                    "skio_qa_token": eventProperties.qaToken,
                    "skio_subscription_lines": JSON.stringify(eventProperties.subscriptionLines),
                    "skio_box_subscription_lines": JSON.stringify(eventProperties.boxSubscriptionLines),
                    "skio_currency_code": eventProperties.currencyCode,
                    "skio_currency_symbol": eventProperties.currencySymbol,
                    "skio_total_subscription_price": eventProperties.total,
                    "skio_has_surprise_discount": eventProperties.hasSurpriseDiscount,
                    "skio_has_surprise_product": eventProperties.hasSurpriseProduct,

                    // Skio Address Fields
                    "skio_address_first_line": eventProperties.shippingAddress.address1,
                    "skio_address_second_line": eventProperties.shippingAddress.address2,
                    "skio_address_city": eventProperties.shippingAddress.city,
                    "skio_address_country": eventProperties.shippingAddress.country,
                    "skio_address_province": eventProperties.shippingAddress.province,
                    "skio_address_zip": eventProperties.shippingAddress.zip,
                },
                "events": [
                    {
                        "event_name": insEventName,
                        "timestamp": insTimestamp,
                    }
                ]
            }]
        }
    
    } else if (insEventName === 'skio_subscription_renewed') {
        return {
            "skip_hook": false,
            "users": [{
                "identifiers": {
                    "email": insEmail
                },
                "attributes": {
                    "skio_subscription_id": eventProperties.subscriptionId,
                    "skio_subscription_status": eventProperties.status,
                    "skio_delivery_price": eventProperties.deliveryPrice,
                    "skio_cancelled_at": moment(eventProperties.cancelledAt).toISOString(),
                    "skio_next_billing_at": moment(eventProperties.nextBillingAt).utc().toISOString(),
                    "skio_billing_interval": eventProperties.billingInterval,
                    "skio_billing_interval_count": eventProperties.intervalCount,
                    "skio_manage_subscription_url": eventProperties.manageSubscriptionUrl,
                    "skio_is_prepaid": eventProperties.isPrepaid,
                    "skio_qa_token": eventProperties.qaToken,
                    "skio_subscription_lines": JSON.stringify(eventProperties.subscriptionLines),
                    "skio_box_subscription_lines": JSON.stringify(eventProperties.boxSubscriptionLines),
                    "skio_currency_code": eventProperties.currencyCode,
                    "skio_currency_symbol": eventProperties.currencySymbol,
                    "skio_total_subscription_price": eventProperties.total,
                    "skio_has_surprise_discount": eventProperties.hasSurpriseDiscount,
                    "skio_has_surprise_product": eventProperties.hasSurpriseProduct,

                    // Skio Address Fields
                    "skio_address_first_line": eventProperties.shippingAddress.address1,
                    "skio_address_second_line": eventProperties.shippingAddress.address2,
                    "skio_address_city": eventProperties.shippingAddress.city,
                    "skio_address_country": eventProperties.shippingAddress.country,
                    "skio_address_province": eventProperties.shippingAddress.province,
                    "skio_address_zip": eventProperties.shippingAddress.zip,
                },
                "events": [
                    {
                        "event_name": insEventName,
                        "timestamp": insTimestamp,
                        "event_params": {
                            "custom": {
                                "skio_subscription_lines": JSON.stringify(eventProperties.subscriptionLines),
                                "skio_box_subscription_lines": JSON.stringify(eventProperties.boxSubscriptionLines),
                                "skio_next_billing_at": moment(eventProperties.nextBillingAt).utc().toISOString(),
                                "skio_total_subscription_price": eventProperties.total
                            }
                        }
                    }
                ]
            }]
        }    
            
    }
}

function eventNameConverter(_eventName) {
    // Convert the event name from Skio to Insider
    let eventName = _eventName;
    switch (_eventName) {
        case 'billingAttemptFailed':
            eventName = 'skio_billing_attempt_failed';
            break;
        case 'cardWillExpire':
            eventName = 'skio_card_will_expire';
            break;
        case 'oosMissingBillingBackInStock':
            eventName = 'skio_oos_missing_billing_back_in_stock';
            break;
        case 'prepaidGiftReceived':
            eventName = 'skio_prepaid_gift_received';
            break;
        case 'subscriptionAutoMerged':
            eventName = 'skio_subscription_auto_merged';
            break;
        case 'subscriptionCancelled':
            eventName = 'skio_subscription_cancelled';
            break;
        case 'subscriptionCreated':
            eventName = 'skio_subscription_created';
            break;
        case 'subscriptionMergeable':
            eventName = 'skio_subscription_mergeable';
            break;
        case 'subscriptionMerged':
            eventName = 'skio_subscription_merged';
            break;
        case 'subscriptionNextBillingDateUpdated':
            eventName = 'skio_subscription_next_billing_date_updated';
            break;
        case 'subscriptionOutOfStock':
            eventName = 'skio_subscription_out_of_stock';
            break;
        case 'subscriptionRenewed':
            eventName = 'skio_subscription_renewed';
            break;
        default:
            eventName = 'insider_default_event';
            break;
    }
    return eventName;
}

module.exports = {
    sendDataToInsider,
    transformData
}