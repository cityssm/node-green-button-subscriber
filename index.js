import { atomToGreenButtonJson } from '@cityssm/green-button-parser';
import axios from 'axios';
import Debug from 'debug';
import { formatDateTimeFiltersParameters } from './utilities.js';
const debug = Debug('green-button-subscriber');
export class GreenButtonSubscriber {
    _configuration;
    _token;
    constructor(configuration) {
        if (configuration !== undefined) {
            this.setConfiguration(configuration);
        }
    }
    setConfiguration(configuration) {
        this._configuration = configuration;
        this._token = undefined;
    }
    setUtilityApiConfiguration(apiToken, baseUrl = 'https://utilityapi.com/') {
        this.setConfiguration({
            baseUrl,
            accessToken: apiToken
        });
    }
    async getAccessToken() {
        if (this._configuration.accessToken !== undefined) {
            this._token = {
                access_token: this._configuration.accessToken,
                expires_in: Number.POSITIVE_INFINITY
            };
            return;
        }
        try {
            const authorizeUrl = `${this._configuration.baseUrl}oauth/authorize`;
            debug(`Authorize URL: ${authorizeUrl}`);
            const response = await axios.post(authorizeUrl, {
                response_type: 'code',
                grant_type: 'client_credentials',
                client_id: this._configuration.clientId,
                client_secret: this._configuration.clientSecret
            }, {
                headers: {
                    Referer: this._configuration.baseUrl
                }
            });
            this._token = response.data;
            debug('Access token obtained successfully.');
            debug('Access Token:', this._token?.access_token);
        }
        catch (error) {
            debug('Error getting access token:', error.response.data);
        }
    }
    async getEndpoint(endpoint, getParameters = {}) {
        if (this._token === undefined ||
            Date.now() >= this._token.expires_in * 1000) {
            debug('Token expired.');
            await this.getAccessToken();
        }
        const headers = {
            Authorization: `Bearer ${this._token?.access_token ?? ''}`
        };
        const apiEndpoint = this._configuration.baseUrl + endpoint;
        debug(`End Point: ${apiEndpoint}`);
        const requestOptions = {
            headers
        };
        if (getParameters !== undefined && Object.keys(getParameters).length > 0) {
            requestOptions.params = getParameters;
        }
        try {
            const response = await axios.get(apiEndpoint, requestOptions);
            return {
                data: response.data,
                status: response.status
            };
        }
        catch (error) {
            debug('Error accessing API endpoint:', error.response.data);
        }
        return undefined;
    }
    async getGreenButtonEndpoint(greenButtonEndpoint, getParameters) {
        const endpointResponse = await this.getEndpoint(`DataCustodian/espi/1_1/resource${greenButtonEndpoint}`, getParameters);
        if (endpointResponse === undefined) {
            return undefined;
        }
        let json;
        if ((endpointResponse.data ?? '') !== '') {
            json = await atomToGreenButtonJson(endpointResponse.data);
        }
        return {
            status: endpointResponse.status,
            json
        };
    }
    async getAuthorizations() {
        return await this.getGreenButtonEndpoint('/Authorization');
    }
    async getAuthorization(authorizationId) {
        return await this.getGreenButtonEndpoint(`/Authorization/${authorizationId}`);
    }
    async getUsagePoints(authorizationId) {
        return await this.getGreenButtonEndpoint(`/Subscription/${authorizationId}/UsagePoint`);
    }
    async getMeterReadings(authorizationId, meterId) {
        return await this.getGreenButtonEndpoint(`/Subscription/${authorizationId}/UsagePoint/${meterId}/MeterReading`);
    }
    async getIntervalBlocks(authorizationId, meterId, readingId) {
        return await this.getGreenButtonEndpoint(`/Subscription/${authorizationId}/UsagePoint/${meterId}/MeterReading/${readingId}/IntervalBlock`);
    }
    async getUsageSummaries(authorizationId, meterId) {
        return await this.getGreenButtonEndpoint(`/Subscription/${authorizationId}/UsagePoint/${meterId}/UsageSummary`);
    }
    async getElectricPowerQualitySummaries(authorizationId, meterId) {
        return await this.getGreenButtonEndpoint(`/Subscription/${authorizationId}/UsagePoint/${meterId}/ElectricPowerQualitySummary`);
    }
    async getCustomers(authorizationId) {
        return await this.getGreenButtonEndpoint(`/RetailCustomer/${authorizationId}/Customer`);
    }
    async getCustomerAccounts(authorizationId, customerId) {
        return await this.getGreenButtonEndpoint(`/RetailCustomer/${authorizationId}/Customer/${customerId}/CustomerAccount`);
    }
    async getCustomerAgreements(authorizationId, customerId, customerAccountId) {
        return await this.getGreenButtonEndpoint(`/RetailCustomer/${authorizationId}/Customer/${customerId}/CustomerAccount/${customerAccountId}/CustomerAgreement`);
    }
    async getBatchSubscriptionsByAuthorization(authorizationId, dateTimeFilters) {
        return await this.getGreenButtonEndpoint(`/Batch/Subscription/${authorizationId}`, formatDateTimeFiltersParameters(dateTimeFilters));
    }
    async getBatchSubscriptionsByMeter(authorizationId, meterId, dateTimeFilters) {
        return await this.getGreenButtonEndpoint(`/Batch/Subscription/${authorizationId}/UsagePoint/${meterId}`, formatDateTimeFiltersParameters(dateTimeFilters));
    }
}
export { helpers } from '@cityssm/green-button-parser';
