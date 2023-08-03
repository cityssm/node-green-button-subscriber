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
export declare function getCustomers(authorizationId: string): Promise<greenButtonTypes.GreenButtonJson | undefined>;
export declare function getCustomerAccounts(authorizationId: string, customerId: string): Promise<greenButtonTypes.GreenButtonJson | undefined>;
export declare function getCustomerAgreements(authorizationId: string, customerId: string, customerAccountId: string): Promise<greenButtonTypes.GreenButtonJson | undefined>;
export declare function getBatchSubscriptions(authorizationId: string): Promise<greenButtonTypes.GreenButtonJson | undefined>;
