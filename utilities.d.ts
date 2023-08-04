import type { DateOrIsoDateString, DateTimeFilters, IsoDateString } from './types.js';
export declare function formatDateTime(dateOrIsoDateString: DateOrIsoDateString): IsoDateString;
export declare function formatDateTimeFiltersParameters(dateTimeFilters?: DateTimeFilters): Record<string, string>;
