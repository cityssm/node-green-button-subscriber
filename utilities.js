export function formatDateTime(dateOrIsoDateString) {
    if (typeof dateOrIsoDateString === 'string') {
        return dateOrIsoDateString;
    }
    const isoDateString = dateOrIsoDateString.toISOString();
    if (isoDateString.length === 24) {
        return (isoDateString.slice(0, -5) + 'Z');
    }
    return isoDateString;
}
export function formatDateTimeFiltersParameters(dateTimeFilters = {}) {
    const parameters = {};
    if (dateTimeFilters.publishedMin !== undefined) {
        parameters['published-min'] = formatDateTime(dateTimeFilters.publishedMin);
    }
    if (dateTimeFilters.publishedMax !== undefined) {
        parameters['published-max'] = formatDateTime(dateTimeFilters.publishedMax);
    }
    if (dateTimeFilters.updatedMin !== undefined) {
        parameters['updated-min'] = formatDateTime(dateTimeFilters.updatedMin);
    }
    if (dateTimeFilters.updatedMax !== undefined) {
        parameters['updated-max'] = formatDateTime(dateTimeFilters.updatedMax);
    }
    return parameters;
}
