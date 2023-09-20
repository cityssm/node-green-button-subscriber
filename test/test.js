import assert from 'node:assert';
import fs from 'node:fs';
import { helpers as greenButtonHelpers } from '@cityssm/green-button-parser';
import { GreenButtonSubscriber } from '../index.js';
import { authorizationId, config, customerAccountId, customerId, meterId, readingId } from './config.js';
describe('node-green-button-subscriber', () => {
    let greenButtonSubscriber;
    before(() => {
        greenButtonSubscriber = new GreenButtonSubscriber(config);
    });
    it('Retrieves authorizations', async () => {
        try {
            const response = await greenButtonSubscriber.getAuthorizations();
            assert.ok(response !== undefined);
            const entries = greenButtonHelpers.getEntriesByContentType(response, 'Authorization');
            console.log(JSON.stringify(entries, undefined, 2));
            assert.ok(entries.length > 0);
        }
        catch (error) {
            console.error(error);
            assert.fail();
        }
    });
    it('Retrieves authorization', async () => {
        try {
            const response = await greenButtonSubscriber.getAuthorization(authorizationId);
            assert.ok(response !== undefined);
            const entries = greenButtonHelpers.getEntriesByContentType(response, 'Authorization');
            assert.ok(entries.length > 0);
        }
        catch (error) {
            console.error(error);
            assert.fail();
        }
    });
    it('Retrieves usage points', async () => {
        try {
            const response = await greenButtonSubscriber.getUsagePoints(authorizationId);
            assert.ok(response !== undefined);
            const entries = greenButtonHelpers.getEntriesByContentType(response, 'UsagePoint');
            assert.ok(entries.length > 0);
        }
        catch (error) {
            console.error(error);
            assert.fail();
        }
    });
    it('Retrieves meter readings', async () => {
        try {
            const response = await greenButtonSubscriber.getMeterReadings(authorizationId, meterId);
            assert.ok(response !== undefined);
            const entries = greenButtonHelpers.getEntriesByContentType(response, 'MeterReading');
            assert.ok(entries.length > 0);
        }
        catch (error) {
            console.error(error);
            assert.fail();
        }
    });
    it('Retrieves usage summaries', async () => {
        try {
            const response = await greenButtonSubscriber.getUsageSummaries(authorizationId, meterId);
            assert.ok(response !== undefined);
            const entries = greenButtonHelpers.getEntriesByContentType(response, 'UsageSummary');
            assert.ok(entries.length > 0);
        }
        catch (error) {
            console.error(error);
            assert.fail();
        }
    });
    it('Retrieves electric power quality summaries', async () => {
        try {
            const response = await greenButtonSubscriber.getElectricPowerQualitySummaries(authorizationId, meterId);
            assert.ok(response !== undefined);
        }
        catch (error) {
            console.error(error);
            assert.fail();
        }
    });
    it('Retrieves interval blocks', async () => {
        try {
            const response = await greenButtonSubscriber.getIntervalBlocks(authorizationId, meterId, readingId);
            assert.ok(response !== undefined);
            const entries = greenButtonHelpers.getEntriesByContentType(response, 'IntervalBlock');
            assert.ok(entries.length > 0);
        }
        catch (error) {
            console.error(error);
            assert.fail();
        }
    });
    it('Retrieves customers', async () => {
        try {
            const response = await greenButtonSubscriber.getCustomers(authorizationId);
            assert.ok(response !== undefined);
            const entries = greenButtonHelpers.getEntriesByContentType(response, 'Customer');
            assert.ok(entries.length > 0);
        }
        catch (error) {
            console.error(error);
            assert.fail();
        }
    });
    it('Retrieves customer accounts', async () => {
        try {
            const response = await greenButtonSubscriber.getCustomerAccounts(authorizationId, customerId);
            assert.ok(response !== undefined);
            const entries = greenButtonHelpers.getEntriesByContentType(response, 'CustomerAccount');
            assert.ok(entries.length > 0);
        }
        catch (error) {
            console.error(error);
            assert.fail();
        }
    });
    it('Retrieves customer agreements', async () => {
        try {
            const response = await greenButtonSubscriber.getCustomerAgreements(authorizationId, customerId, customerAccountId);
            assert.ok(response !== undefined);
            const entries = greenButtonHelpers.getEntriesByContentType(response, 'CustomerAgreement');
            assert.ok(entries.length > 0);
        }
        catch (error) {
            console.error(error);
            assert.fail();
        }
    });
    it('Retrieves batch subscriptions by authorization', async () => {
        try {
            const response = await greenButtonSubscriber.getBatchSubscriptionsByAuthorization(authorizationId, {
                publishedMax: new Date(2023, 3 - 1, 28)
            });
            assert.ok(response !== undefined);
            fs.writeFileSync('test/_output/batchSubscription.json', JSON.stringify(response, undefined, 2));
            const entries = greenButtonHelpers.getEntriesByContentType(response, 'IntervalBlock');
            assert.ok(entries.length > 0);
        }
        catch (error) {
            console.error(error);
            assert.fail();
        }
    });
    it('Retrieves batch subscriptions by meter', async () => {
        try {
            const response = await greenButtonSubscriber.getBatchSubscriptionsByMeter(authorizationId, meterId);
            assert.ok(response !== undefined);
            const entries = greenButtonHelpers.getEntriesByContentType(response, 'IntervalBlock');
            assert.ok(entries.length > 0);
        }
        catch (error) {
            console.error(error);
            assert.fail();
        }
    });
});
