import type { GreenButtonJson } from '@cityssm/green-button-parser/types/entryTypes.js';
export type IsoDateString = `${string}-${string}-${string}T${string}:${string}:${string}Z`;
export type DateOrIsoDateString = Date | IsoDateString;
export interface DateTimeFilters {
    publishedMin?: DateOrIsoDateString;
    publishedMax?: DateOrIsoDateString;
    updatedMin?: DateOrIsoDateString;
    updatedMax?: DateOrIsoDateString;
}
export interface GreenButtonSubscriberConfiguration {
    baseUrl: `https://${string}/`;
    oauthUrl?: `https://${string}`;
    clientId?: string;
    clientSecret?: string;
    accessToken?: string;
}
export type GreenButtonResponse = {
    status: 200;
    json: GreenButtonJson;
} | {
    status: number;
    json?: GreenButtonJson;
};
