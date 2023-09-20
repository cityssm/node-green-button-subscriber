import { type types as greenButtonTypes } from '@cityssm/green-button-parser';
import type { DateTimeFilters } from './types.js';
export interface GreenButtonSubscriberConfiguration {
    baseUrl: `${string}/`;
    clientId?: string;
    clientSecret?: string;
    accessToken?: string;
}
export declare class GreenButtonSubscriber {
    _configuration: GreenButtonSubscriberConfiguration;
    _token: {
        access_token: string;
        expires_in: number;
    };
    constructor(configuration?: GreenButtonSubscriberConfiguration);
    setConfiguration(configuration: GreenButtonSubscriberConfiguration): void;
    setUtilityApiConfiguration(apiToken: string, baseUrl?: `${string}/`): void;
    getAccessToken(): Promise<void>;
    getEndpoint(endpoint: string, getParameters?: Record<string, string>): Promise<string | undefined>;
    getGreenButtonEndpoint(greenButtonEndpoint: `/${string}`, getParameters?: Record<string, string>): Promise<greenButtonTypes.GreenButtonJson | undefined>;
    getAuthorizations(): Promise<greenButtonTypes.GreenButtonJson | undefined>;
    getAuthorization(authorizationId: string): Promise<greenButtonTypes.GreenButtonJson | undefined>;
    getUsagePoints(authorizationId: string): Promise<greenButtonTypes.GreenButtonJson | undefined>;
    getMeterReadings(authorizationId: string, meterId: string): Promise<greenButtonTypes.GreenButtonJson | undefined>;
    getIntervalBlocks(authorizationId: string, meterId: string, readingId: string): Promise<greenButtonTypes.GreenButtonJson | undefined>;
    getUsageSummaries(authorizationId: string, meterId: string): Promise<greenButtonTypes.GreenButtonJson | undefined>;
    getElectricPowerQualitySummaries(authorizationId: string, meterId: string): Promise<greenButtonTypes.GreenButtonJson | undefined>;
    getCustomers(authorizationId: string): Promise<greenButtonTypes.GreenButtonJson | undefined>;
    getCustomerAccounts(authorizationId: string, customerId: string): Promise<greenButtonTypes.GreenButtonJson | undefined>;
    getCustomerAgreements(authorizationId: string, customerId: string, customerAccountId: string): Promise<greenButtonTypes.GreenButtonJson | undefined>;
    getBatchSubscriptionsByAuthorization(authorizationId: string, dateTimeFilters?: DateTimeFilters): Promise<greenButtonTypes.GreenButtonJson | undefined>;
    getBatchSubscriptionsByMeter(authorizationId: string, meterId: string, dateTimeFilters?: DateTimeFilters): Promise<greenButtonTypes.GreenButtonJson | undefined>;
}
export type { types } from '@cityssm/green-button-parser';
export { helpers } from '@cityssm/green-button-parser';
