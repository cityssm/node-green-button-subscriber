import assert from 'node:assert';
import { formatDateTimeFiltersParameters } from '../utilities.js';
describe('node-green-button-subscriber/helpers', () => {
    it('Formats Dates and ISO strings properly', () => {
        const isoDate = '2023-01-02T12:34:56Z';
        const dateTimeFilters = {
            publishedMin: isoDate,
            publishedMax: new Date(isoDate)
        };
        const parameters = formatDateTimeFiltersParameters(dateTimeFilters);
        assert.strictEqual(parameters['published-min'], isoDate);
        assert.strictEqual(parameters['published-max'], isoDate);
    });
});
