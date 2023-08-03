import type { GreenButtonJson } from '@cityssm/green-button-parser/types/entryTypes.js';
export interface Configuration {
    baseUrl: `${string}/`;
    clientId?: string;
    clientSecret?: string;
    accessToken?: string;
}
export declare function setConfiguration(configuration: Configuration): void;
export declare function setUtilityApiConfiguration(apiToken: string, baseUrl?: `${string}/`): void;
export declare function getEndpoint(endpoint: string): Promise<string | undefined>;
export declare function getGreenButtonEndpoint(greenButtonEndpoint: `/${string}`): Promise<GreenButtonJson | undefined>;
export declare function getAuthorizations(): Promise<GreenButtonJson | undefined>;
export declare function getCustomers(authorizationId: string): Promise<GreenButtonJson | undefined>;
export declare function getCustomerAccounts(authorizationId: string, customerId: string): Promise<GreenButtonJson | undefined>;
export declare function getCustomerAgreements(authorizationId: string, customerId: string, customerAccountId: string): Promise<GreenButtonJson | undefined>;
export declare function getBatchSubscriptions(authorizationId: string): Promise<GreenButtonJson | undefined>;
