import assert from 'node:assert';
import fs from 'node:fs/promises';
import { helpers as greenButtonHelpers } from '@cityssm/green-button-parser';
import * as greenButtonSubscriber from '../index.js';
import { authorizationId, config, customerAccountId, customerId } from './config.js';
describe('node-green-button-subscriber', () => {
    before(() => {
        greenButtonSubscriber.setConfiguration(config);
    });
    it('Retrieves authorizations', async () => {
        try {
            const response = await greenButtonSubscriber.getAuthorizations();
            assert.ok(response !== undefined);
            const entries = greenButtonHelpers.getEntriesByContentType(response, 'Authorization');
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
    it('Retrieves batch subscriptions', async () => {
        try {
            const response = await greenButtonSubscriber.getBatchSubscriptions(authorizationId);
            assert.ok(response !== undefined);
            await fs.writeFile('./test/_output/batchSubscription.json', JSON.stringify(response, undefined, 2));
            const entries = greenButtonHelpers.getEntriesByContentType(response, 'IntervalBlock');
            assert.ok(entries.length > 0);
        }
        catch (error) {
            console.error(error);
            assert.fail();
        }
    });
});
