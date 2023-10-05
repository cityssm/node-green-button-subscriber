import { atomToGreenButtonJson } from '@cityssm/green-button-parser';
import axios from 'axios';
import Debug from 'debug';
import { formatDateTimeFiltersParameters } from './utilities.js';
const debug = Debug('green-button-subscriber');
export class GreenButtonSubscriber {
    #configuration;
    #token;
    constructor(configuration) {
        if (configuration !== undefined) {
            this.setConfiguration(configuration);
        }
    }
    setConfiguration(configuration) {
        this.#configuration = configuration;
        this.#token = undefined;
    }
    setUtilityApiConfiguration(apiToken, baseUrl = 'https://utilityapi.com/') {
        this.setConfiguration({
            baseUrl,
            accessToken: apiToken
        });
    }
    async #getAccessToken() {
        if (this.#configuration.accessToken !== undefined) {
            this.#token = {
                access_token: this.#configuration.accessToken,
                expires_in: Number.POSITIVE_INFINITY
            };
            return;
        }
        try {
            const authorizeUrl = `${this.#configuration.baseUrl}oauth/authorize`;
            debug(`Authorize URL: ${authorizeUrl}`);
            const response = await axios.post(authorizeUrl, {
                response_type: 'code',
                grant_type: 'client_credentials',
                client_id: this.#configuration.clientId,
                client_secret: this.#configuration.clientSecret
            }, {
                headers: {
                    Referer: this.#configuration.baseUrl
                }
            });
            this.#token = response.data;
            debug('Access token obtained successfully.');
            debug('Access Token:', this.#token?.access_token);
        }
        catch (error) {
            debug('Error getting access token:', error.response.data);
        }
    }
    async #getEndpoint(apiEndpoint, getParameters = {}) {
        if (this.#token === undefined ||
            Date.now() >= this.#token.expires_in * 1000) {
            debug('Token expired.');
            await this.#getAccessToken();
        }
        const headers = {
            Authorization: `Bearer ${this.#token?.access_token ?? ''}`
        };
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
    async getGreenButtonHttpsLink(greenButtonHttpsLink, getParameters) {
        const endpointResponse = await this.#getEndpoint(greenButtonHttpsLink, getParameters);
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
    async getGreenButtonEndpoint(greenButtonEndpoint, getParameters) {
        return await this.getGreenButtonHttpsLink(`${this.#configuration.baseUrl}DataCustodian/espi/1_1/resource${greenButtonEndpoint}`, getParameters);
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
