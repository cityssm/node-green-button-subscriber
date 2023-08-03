import { atomToGreenButtonJson } from '@cityssm/green-button-parser';
import axios from 'axios';
import Debug from 'debug';
const debug = Debug('green-button-subscriber');
let _configuration;
let _token;
export function setConfiguration(configuration) {
    _configuration = configuration;
}
export function setUtilityApiConfiguration(apiToken, baseUrl = 'https://utilityapi.com/') {
    setConfiguration({
        baseUrl,
        accessToken: apiToken
    });
}
async function getAccessToken() {
    if (_configuration.accessToken !== undefined) {
        _token = {
            access_token: _configuration.accessToken,
            expires_in: Number.POSITIVE_INFINITY
        };
        return;
    }
    try {
        const authorizeUrl = _configuration.baseUrl + 'oauth/authorize';
        debug(`Authorize URL: ${authorizeUrl}`);
        const response = await axios.post(authorizeUrl, {
            response_type: 'code',
            grant_type: 'client_credentials',
            client_id: _configuration.clientId,
            client_secret: _configuration.clientSecret
        }, {
            headers: {
                Referer: _configuration.baseUrl
            }
        });
        _token = response.data;
        debug('Access token obtained successfully.');
        debug('Access Token:', _token.access_token);
    }
    catch (error) {
        debug('Error getting access token:', error.response.data);
    }
}
export async function getEndpoint(endpoint) {
    if (_token === undefined || Date.now() >= _token.expires_in * 1000) {
        debug('Token expired.');
        await getAccessToken();
    }
    const headers = {
        Authorization: `Bearer ${_token.access_token}`
    };
    const apiEndpoint = _configuration.baseUrl + endpoint;
    debug(`End Point: ${apiEndpoint}`);
    try {
        const response = await axios.get(apiEndpoint, { headers });
        return response.data;
    }
    catch (error) {
        debug('Error accessing API endpoint:', error.response.data);
    }
}
export async function getGreenButtonEndpoint(greenButtonEndpoint) {
    const greenButtonXml = await getEndpoint('DataCustodian/espi/1_1/resource' + greenButtonEndpoint);
    if (greenButtonXml === undefined) {
        return undefined;
    }
    return await atomToGreenButtonJson(greenButtonXml);
}
export async function getAuthorizations() {
    return await getGreenButtonEndpoint('/Authorization');
}
export async function getCustomers(authorizationId) {
    return await getGreenButtonEndpoint(`/RetailCustomer/${authorizationId}/Customer`);
}
export async function getCustomerAccounts(authorizationId, customerId) {
    return await getGreenButtonEndpoint(`/RetailCustomer/${authorizationId}/Customer/${customerId}/CustomerAccount`);
}
export async function getCustomerAgreements(authorizationId, customerId, customerAccountId) {
    return await getGreenButtonEndpoint(`/RetailCustomer/${authorizationId}/Customer/${customerId}/CustomerAccount/${customerAccountId}/CustomerAgreement`);
}
export async function getBatchSubscriptions(authorizationId) {
    return await getGreenButtonEndpoint(`/Batch/Subscription/${authorizationId}`);
}
