import assert from 'node:assert'

import * as greenButtonParser from '@cityssm/green-button-parser'

import * as greenButtonSubscriber from '../index.js'

import {
  authorizationId,
  config,
  customerAccountId,
  customerId
} from './config.js'

describe('node-green-button-subscriber', () => {
  before(() => {
    greenButtonSubscriber.setConfiguration(config)
  })

  it('Retrieves authorizations', async () => {
    try {
      const response = await greenButtonSubscriber.getAuthorizations()

      assert.ok(response !== undefined)

      const entries = greenButtonParser.helpers.getEntriesByContentType(
        response,
        'Authorization'
      )
      assert.ok(entries.length > 0)
    } catch (error) {
      console.error(error)
      assert.fail()
    }
  })

  it('Retrieves customers', async () => {
    try {
      const response = await greenButtonSubscriber.getCustomers(authorizationId)

      assert.ok(response !== undefined)

      const entries = greenButtonParser.helpers.getEntriesByContentType(
        response,
        'Customer'
      )
      assert.ok(entries.length > 0)
    } catch (error) {
      console.error(error)
      assert.fail()
    }
  })

  it('Retrieves customer accounts', async () => {
    try {
      const response = await greenButtonSubscriber.getCustomerAccounts(
        authorizationId,
        customerId
      )

      assert.ok(response !== undefined)

      const entries = greenButtonParser.helpers.getEntriesByContentType(
        response,
        'CustomerAccount'
      )
      assert.ok(entries.length > 0)
    } catch (error) {
      console.error(error)
      assert.fail()
    }
  })

  it('Retrieves customer agreements', async () => {
    try {
      const response = await greenButtonSubscriber.getCustomerAgreements(
        authorizationId,
        customerId,
        customerAccountId
      )

      assert.ok(response !== undefined)

      const entries = greenButtonParser.helpers.getEntriesByContentType(
        response,
        'CustomerAgreement'
      )
      assert.ok(entries.length > 0)
    } catch (error) {
      console.error(error)
      assert.fail()
    }
  })

  it('Retrieves batch subscriptions', async () => {
    try {
      const response = await greenButtonSubscriber.getBatchSubscriptions(
        authorizationId
      )

      assert.ok(response !== undefined)

      const entries = greenButtonParser.helpers.getEntriesByContentType(
        response,
        'IntervalBlock'
      )
      assert.ok(entries.length > 0)
    } catch (error) {
      console.error(error)
      assert.fail()
    }
  })
})
