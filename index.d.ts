import { type types as greenButtonTypes } from '@cityssm/green-button-parser';
export interface Configuration {
    baseUrl: `${string}/`;
    clientId?: string;
    clientSecret?: string;
    accessToken?: string;
}
export declare function setConfiguration(configuration: Configuration): void;
export declare function setUtilityApiConfiguration(apiToken: string, baseUrl?: `${string}/`): void;
export declare function getEndpoint(endpoint: string): Promise<string | undefined>;
export declare function getGreenButtonEndpoint(greenButtonEndpoint: `/${string}`): Promise<greenButtonTypes.GreenButtonJson | undefined>;
export declare function getAuthorizations(): Promise<greenButtonTypes.GreenButtonJson | undefined>;
export declare function getAuthorization(authorizationId: string): Promise<greenButtonTypes.GreenButtonJson | undefined>;
export declare function getUsagePoints(authorizationId: string): Promise<greenButtonTypes.GreenButtonJson | undefined>;
export declare function getMeterReadings(authorizationId: string, meterId: string): Promise<greenButtonTypes.GreenButtonJson | undefined>;
export declare function getIntervalBlocks(authorizationId: string, meterId: string, readingId: string): Promise<greenButtonTypes.GreenButtonJson | undefined>;
export declare function getUsageSummaries(authorizationId: string, meterId: string): Promise<greenButtonTypes.GreenButtonJson | undefined>;
export declare function getElectricPowerQualitySummaries(authorizationId: string, meterId: string): Promise<greenButtonTypes.GreenButtonJson | undefined>;
export declare function getCustomers(authorizationId: string): Promise<greenButtonTypes.GreenButtonJson | undefined>;
export declare function getCustomerAccounts(authorizationId: string, customerId: string): Promise<greenButtonTypes.GreenButtonJson | undefined>;
export declare function getCustomerAgreements(authorizationId: string, customerId: string, customerAccountId: string): Promise<greenButtonTypes.GreenButtonJson | undefined>;
export declare function getBatchSubscriptionsByAuthorization(authorizationId: string): Promise<greenButtonTypes.GreenButtonJson | undefined>;
export declare function getBatchSubscriptionsByMeter(authorizationId: string, meterId: string): Promise<greenButtonTypes.GreenButtonJson | undefined>;
