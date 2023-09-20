// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/indent */

import {
  atomToGreenButtonJson,
  type types as greenButtonTypes
} from '@cityssm/green-button-parser'
import axios, { type AxiosRequestConfig } from 'axios'
import Debug from 'debug'

import type { DateTimeFilters } from './types.js'
import { formatDateTimeFiltersParameters } from './utilities.js'

const debug = Debug('green-button-subscriber')

export interface GreenButtonSubscriberConfiguration {
  baseUrl: `${string}/`
  clientId?: string
  clientSecret?: string
  accessToken?: string
}

export class GreenButtonSubscriber {
  _configuration: GreenButtonSubscriberConfiguration
  _token: {
    access_token: string
    expires_in: number
  }

  constructor(configuration?: GreenButtonSubscriberConfiguration) {
    if (configuration !== undefined) {
      this.setConfiguration(configuration)
    }
  }

  setConfiguration(configuration: GreenButtonSubscriberConfiguration): void {
    this._configuration = configuration
  }

  setUtilityApiConfiguration(
    apiToken: string,
    baseUrl: `${string}/` = 'https://utilityapi.com/'
  ): void {
    this.setConfiguration({
      baseUrl,
      accessToken: apiToken
    })
  }

  async getAccessToken(): Promise<void> {
    if (this._configuration.accessToken !== undefined) {
      this._token = {
        access_token: this._configuration.accessToken,
        expires_in: Number.POSITIVE_INFINITY
      }
      return
    }

    try {
      const authorizeUrl = `${this._configuration.baseUrl}oauth/authorize`

      debug(`Authorize URL: ${authorizeUrl}`)

      const response = await axios.post(
        authorizeUrl,
        {
          response_type: 'code',
          grant_type: 'client_credentials',
          client_id: this._configuration.clientId,
          client_secret: this._configuration.clientSecret
        },
        {
          headers: {
            Referer: this._configuration.baseUrl
          }
        }
      )

      this._token = response.data

      debug('Access token obtained successfully.')
      debug('Access Token:', this._token.access_token)
    } catch (error) {
      debug('Error getting access token:', error.response.data)
    }
  }

  async getEndpoint(
    endpoint: string,
    getParameters: Record<string, string> = {}
  ): Promise<string | undefined> {
    if (
      this._token === undefined ||
      Date.now() >= this._token.expires_in * 1000
    ) {
      // If the token is not obtained or has expired, get a new one
      debug('Token expired.')
      await this.getAccessToken()
    }

    // Set the access token in the request headers
    const headers = {
      Authorization: `Bearer ${this._token.access_token}`
    }

    const apiEndpoint = this._configuration.baseUrl + endpoint
    debug(`End Point: ${apiEndpoint}`)

    const requestOptions: AxiosRequestConfig = {
      headers
    }

    if (getParameters !== undefined && Object.keys(getParameters).length > 0) {
      requestOptions.params = getParameters
    }

    try {
      const response = await axios.get(apiEndpoint, requestOptions)
      return response.data
    } catch (error) {
      debug('Error accessing API endpoint:', error.response.data)
    }

    return undefined
  }

  async getGreenButtonEndpoint(
    greenButtonEndpoint: `/${string}`,
    getParameters?: Record<string, string>
  ): Promise<greenButtonTypes.GreenButtonJson | undefined> {
    const greenButtonXml = await this.getEndpoint(
      `DataCustodian/espi/1_1/resource${greenButtonEndpoint}`,
      getParameters
    )

    if (greenButtonXml === undefined) {
      return undefined
    }

    return await atomToGreenButtonJson(greenButtonXml)
  }

  /**
   * Get a list of Authorizations from customers.
   * @returns GreenButtonJson with Authorization content entries.
   */
  async getAuthorizations(): Promise<
    greenButtonTypes.GreenButtonJson | undefined
  > {
    return await this.getGreenButtonEndpoint('/Authorization')
  }

  /**
   * Get a specific customer authorization.
   * @param authorizationId
   * @returns GreenButtonJson with Authorization content entries.
   */
  async getAuthorization(
    authorizationId: string
  ): Promise<greenButtonTypes.GreenButtonJson | undefined> {
    return await this.getGreenButtonEndpoint(
      `/Authorization/${authorizationId}`
    )
  }

  /**
   * Get a list of Usage Points.
   * @param authorizationId
   * @returns GreenButtonJson with UsagePoint content entries.
   */
  async getUsagePoints(
    authorizationId: string
  ): Promise<greenButtonTypes.GreenButtonJson | undefined> {
    return await this.getGreenButtonEndpoint(
      `/Subscription/${authorizationId}/UsagePoint`
    )
  }

  /**
   * Get a list of Meter Readings.
   * @param authorizationId
   * @param meterId
   * @returns GreenButtonJson with MeterReading content entries.
   */
  async getMeterReadings(
    authorizationId: string,
    meterId: string
  ): Promise<greenButtonTypes.GreenButtonJson | undefined> {
    return await this.getGreenButtonEndpoint(
      `/Subscription/${authorizationId}/UsagePoint/${meterId}/MeterReading`
    )
  }

  /**
   * Get a list of Interval Blocks.
   * @param authorizationId
   * @returns GreenButtonJson with MeterReading content entries.
   */
  async getIntervalBlocks(
    authorizationId: string,
    meterId: string,
    readingId: string
  ): Promise<greenButtonTypes.GreenButtonJson | undefined> {
    return await this.getGreenButtonEndpoint(
      `/Subscription/${authorizationId}/UsagePoint/${meterId}/MeterReading/${readingId}/IntervalBlock`
    )
  }

  /**
   * Get a list of Usage Summaries.
   * @param authorizationId
   * @param meterId
   * @returns GreenButtonJson with UsageSummary content entries.
   */
  async getUsageSummaries(
    authorizationId: string,
    meterId: string
  ): Promise<greenButtonTypes.GreenButtonJson | undefined> {
    return await this.getGreenButtonEndpoint(
      `/Subscription/${authorizationId}/UsagePoint/${meterId}/UsageSummary`
    )
  }

  /**
   * Get a list of Electric Power Quaility Summaries.
   * @param authorizationId
   * @param meterId
   * @returns GreenButtonJson with ElectricPowerQualitySummary content entries.
   */
  async getElectricPowerQualitySummaries(
    authorizationId: string,
    meterId: string
  ): Promise<greenButtonTypes.GreenButtonJson | undefined> {
    return await this.getGreenButtonEndpoint(
      `/Subscription/${authorizationId}/UsagePoint/${meterId}/ElectricPowerQualitySummary`
    )
  }

  async getCustomers(
    authorizationId: string
  ): Promise<greenButtonTypes.GreenButtonJson | undefined> {
    return await this.getGreenButtonEndpoint(
      `/RetailCustomer/${authorizationId}/Customer`
    )
  }

  async getCustomerAccounts(
    authorizationId: string,
    customerId: string
  ): Promise<greenButtonTypes.GreenButtonJson | undefined> {
    return await this.getGreenButtonEndpoint(
      `/RetailCustomer/${authorizationId}/Customer/${customerId}/CustomerAccount`
    )
  }

  async getCustomerAgreements(
    authorizationId: string,
    customerId: string,
    customerAccountId: string
  ): Promise<greenButtonTypes.GreenButtonJson | undefined> {
    return await this.getGreenButtonEndpoint(
      `/RetailCustomer/${authorizationId}/Customer/${customerId}/CustomerAccount/${customerAccountId}/CustomerAgreement`
    )
  }

  /**
   * Get all data (usage points, usage summaries, interval blocks, etc.)
   * for a specific Authorization
   * @param authorizationId
   * @returns
   */
  async getBatchSubscriptionsByAuthorization(
    authorizationId: string,
    dateTimeFilters?: DateTimeFilters
  ): Promise<greenButtonTypes.GreenButtonJson | undefined> {
    return await this.getGreenButtonEndpoint(
      `/Batch/Subscription/${authorizationId}`,
      formatDateTimeFiltersParameters(dateTimeFilters)
    )
  }

  /**
   * Get all data (usage points, usage summaries, interval blocks, etc.)
   * for a specific Meter
   * @param authorizationId
   * @param meterId
   * @returns
   */
  async getBatchSubscriptionsByMeter(
    authorizationId: string,
    meterId: string,
    dateTimeFilters?: DateTimeFilters
  ): Promise<greenButtonTypes.GreenButtonJson | undefined> {
    return await this.getGreenButtonEndpoint(
      `/Batch/Subscription/${authorizationId}/UsagePoint/${meterId}`,
      formatDateTimeFiltersParameters(dateTimeFilters)
    )
  }
}

export type { types } from '@cityssm/green-button-parser'
export { helpers } from '@cityssm/green-button-parser'
