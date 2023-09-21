import type { DateTimeFilters, GreenButtonResponse } from './types.js';
export interface GreenButtonSubscriberConfiguration {
    baseUrl: `${string}/`;
    clientId?: string;
    clientSecret?: string;
    accessToken?: string;
}
interface GetEndpointResponse {
    data: string;
    status: number;
}
export declare class GreenButtonSubscriber {
    _configuration: GreenButtonSubscriberConfiguration;
    _token: {
        access_token: string;
        expires_in: number;
    } | undefined;
    constructor(configuration?: GreenButtonSubscriberConfiguration);
    setConfiguration(configuration: GreenButtonSubscriberConfiguration): void;
    setUtilityApiConfiguration(apiToken: string, baseUrl?: `${string}/`): void;
    getAccessToken(): Promise<void>;
    getEndpoint(endpoint: string, getParameters?: Record<string, string>): Promise<GetEndpointResponse | undefined>;
    getGreenButtonEndpoint(greenButtonEndpoint: `/${string}`, getParameters?: Record<string, string>): Promise<GreenButtonResponse | undefined>;
    getAuthorizations(): Promise<GreenButtonResponse | undefined>;
    getAuthorization(authorizationId: string): Promise<GreenButtonResponse | undefined>;
    getUsagePoints(authorizationId: string): Promise<GreenButtonResponse | undefined>;
    getMeterReadings(authorizationId: string, meterId: string): Promise<GreenButtonResponse | undefined>;
    getIntervalBlocks(authorizationId: string, meterId: string, readingId: string): Promise<GreenButtonResponse | undefined>;
    getUsageSummaries(authorizationId: string, meterId: string): Promise<GreenButtonResponse | undefined>;
    getElectricPowerQualitySummaries(authorizationId: string, meterId: string): Promise<GreenButtonResponse | undefined>;
    getCustomers(authorizationId: string): Promise<GreenButtonResponse | undefined>;
    getCustomerAccounts(authorizationId: string, customerId: string): Promise<GreenButtonResponse | undefined>;
    getCustomerAgreements(authorizationId: string, customerId: string, customerAccountId: string): Promise<GreenButtonResponse | undefined>;
    getBatchSubscriptionsByAuthorization(authorizationId: string, dateTimeFilters?: DateTimeFilters): Promise<GreenButtonResponse | undefined>;
    getBatchSubscriptionsByMeter(authorizationId: string, meterId: string, dateTimeFilters?: DateTimeFilters): Promise<GreenButtonResponse | undefined>;
}
export type { types } from '@cityssm/green-button-parser';
export { helpers } from '@cityssm/green-button-parser';
