// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/indent */

import { atomToGreenButtonJson } from '@cityssm/green-button-parser'
import type { GreenButtonJson } from '@cityssm/green-button-parser/types/entryTypes.js'
import axios, { type AxiosRequestConfig } from 'axios'
import Debug from 'debug'

import { apiConfigurations } from './apiConfigurations.js'
import type {
  DateTimeFilters,
  GreenButtonResponse,
  GreenButtonSubscriberConfiguration
} from './types.js'
import { formatDateTimeFiltersParameters } from './utilities.js'

const debug = Debug('green-button-subscriber')

interface GetEndpointResponse {
  data: string
  status: number
}

export class GreenButtonSubscriber {
  #configuration: GreenButtonSubscriberConfiguration
  #token:
    | {
        access_token: string
        expires_in: number
        refresh_token?: string
      }
    | undefined

  constructor(configuration?: GreenButtonSubscriberConfiguration) {
    if (configuration !== undefined) {
      this.setConfiguration(configuration)
    }
  }

  setConfiguration(configuration: GreenButtonSubscriberConfiguration): void {
    this.#configuration = configuration
    this.#token = undefined
  }

  setUtilityApiConfiguration(
    apiToken: string,
    baseUrl: `https://${string}/` = apiConfigurations.utilityAPI.baseUrl
  ): void {
    this.setConfiguration({
      baseUrl,
      accessToken: apiToken
    })
  }

  async #getAccessToken(): Promise<void> {
    if (this.#configuration.accessToken !== undefined) {
      this.#token = {
        access_token: this.#configuration.accessToken,
        expires_in: Number.POSITIVE_INFINITY
      }
      return
    }

    try {
      const authorizeUrl =
        this.#configuration.oauthUrl ??
        `${this.#configuration.baseUrl}oauth/authorize`

      debug(`Authorize URL: ${authorizeUrl}`)

      const response = await axios.post(
        authorizeUrl,
        'grant_type=client_credentials&scope=FB=36_40',
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${Buffer.from(
              `${this.#configuration.clientId}:${
                this.#configuration.clientSecret
              }`
            ).toString('base64')}`
          }
        }
      )

      this.#token = response.data

      debug('Access token obtained successfully.')
      debug('Access Token:', this.#token)
    } catch (error) {
      debug('Error getting access token:', error.response.data)
    }
  }

  async #getEndpoint(
    apiEndpoint: string,
    getParameters: Record<string, string> = {}
  ): Promise<GetEndpointResponse | undefined> {
    if (
      this.#token === undefined ||
      Date.now() >= this.#token.expires_in * 1000
    ) {
      // If the token is not obtained or has expired, get a new one
      debug('Token expired.')
      await this.#getAccessToken()
    }

    // Set the access token in the request headers
    const headers = {
      Authorization: `Bearer ${this.#token?.access_token ?? ''}`
    }

    debug(`End Point: ${apiEndpoint}`)

    const requestOptions: AxiosRequestConfig = {
      headers
    }

    if (getParameters !== undefined && Object.keys(getParameters).length > 0) {
      requestOptions.params = getParameters
    }

    try {
      const response = await axios.get(apiEndpoint, requestOptions)
      return {
        data: response.data,
        status: response.status
      }
    } catch (error) {
      debug('Error accessing API endpoint:', error.response.data)
    }

    return undefined
  }

  /**
   * Retrieves and parses the data from a full Green Button URL.
   * Helpful when following related links returned by previous API calls.
   * @param greenButtonHttpsLink ex. "https://example.com/DataCustodian/espi/1_1/resource/..."
   * @param getParameters
   * @returns
   */
  async getGreenButtonHttpsLink(
    greenButtonHttpsLink: string,
    getParameters?: Record<string, string>
  ): Promise<GreenButtonResponse | undefined> {
    const endpointResponse = await this.#getEndpoint(
      greenButtonHttpsLink,
      getParameters
    )

    if (endpointResponse === undefined) {
      return undefined
    }

    let json: GreenButtonJson | undefined

    if ((endpointResponse.data ?? '') !== '') {
      json = await atomToGreenButtonJson(endpointResponse.data)
    }

    return {
      status: endpointResponse.status,
      json
    }
  }

  /**
   * Retrieves and parses the data from a Green Button endpoint.
   * @param greenButtonEndpoint ex. "/Authorization", "/Batch/Subscription/xxxxxx"
   * @param getParameters
   * @returns
   */
  async getGreenButtonEndpoint(
    greenButtonEndpoint: `/${string}`,
    getParameters?: Record<string, string>
  ): Promise<GreenButtonResponse | undefined> {
    return await this.getGreenButtonHttpsLink(
      `${this.#configuration.baseUrl}espi/1_1/resource${greenButtonEndpoint}`,
      getParameters
    )
  }

  /**
   * Get a list of Authorizations from customers.
   * @returns GreenButtonResponse with Authorization content entries.
   */
  async getAuthorizations(): Promise<GreenButtonResponse | undefined> {
    return await this.getGreenButtonEndpoint('/Authorization')
  }

  /**
   * Get a specific customer authorization.
   * @param authorizationId
   * @returns GreenButtonResponse with Authorization content entries.
   */
  async getAuthorization(
    authorizationId: string
  ): Promise<GreenButtonResponse | undefined> {
    return await this.getGreenButtonEndpoint(
      `/Authorization/${authorizationId}`
    )
  }

  /**
   * Get a list of Usage Points.
   * @param authorizationId
   * @returns GreenButtonResponse with UsagePoint content entries.
   */
  async getUsagePoints(
    authorizationId: string
  ): Promise<GreenButtonResponse | undefined> {
    return await this.getGreenButtonEndpoint(
      `/Subscription/${authorizationId}/UsagePoint`
    )
  }

  /**
   * Get a list of Meter Readings.
   * @param authorizationId
   * @param meterId
   * @returns GreenButtonResponse with MeterReading content entries.
   */
  async getMeterReadings(
    authorizationId: string,
    meterId: string
  ): Promise<GreenButtonResponse | undefined> {
    return await this.getGreenButtonEndpoint(
      `/Subscription/${authorizationId}/UsagePoint/${meterId}/MeterReading`
    )
  }

  /**
   * Get a list of Interval Blocks.
   * @param authorizationId
   * @returns GreenButtonResponse with MeterReading content entries.
   */
  async getIntervalBlocks(
    authorizationId: string,
    meterId: string,
    readingId: string
  ): Promise<GreenButtonResponse | undefined> {
    return await this.getGreenButtonEndpoint(
      `/Subscription/${authorizationId}/UsagePoint/${meterId}/MeterReading/${readingId}/IntervalBlock`
    )
  }

  /**
   * Get a list of Usage Summaries.
   * @param authorizationId
   * @param meterId
   * @returns GreenButtonResponse with UsageSummary content entries.
   */
  async getUsageSummaries(
    authorizationId: string,
    meterId: string
  ): Promise<GreenButtonResponse | undefined> {
    return await this.getGreenButtonEndpoint(
      `/Subscription/${authorizationId}/UsagePoint/${meterId}/UsageSummary`
    )
  }

  /**
   * Get a list of Electric Power Quality Summaries.
   * @param authorizationId
   * @param meterId
   * @returns GreenButtonResponse with ElectricPowerQualitySummary content entries.
   */
  async getElectricPowerQualitySummaries(
    authorizationId: string,
    meterId: string
  ): Promise<GreenButtonResponse | undefined> {
    return await this.getGreenButtonEndpoint(
      `/Subscription/${authorizationId}/UsagePoint/${meterId}/ElectricPowerQualitySummary`
    )
  }

  async getCustomers(
    authorizationId: string
  ): Promise<GreenButtonResponse | undefined> {
    return await this.getGreenButtonEndpoint(
      `/RetailCustomer/${authorizationId}/Customer`
    )
  }

  async getCustomerAccounts(
    authorizationId: string,
    customerId: string
  ): Promise<GreenButtonResponse | undefined> {
    return await this.getGreenButtonEndpoint(
      `/RetailCustomer/${authorizationId}/Customer/${customerId}/CustomerAccount`
    )
  }

  async getCustomerAgreements(
    authorizationId: string,
    customerId: string,
    customerAccountId: string
  ): Promise<GreenButtonResponse | undefined> {
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
  ): Promise<GreenButtonResponse | undefined> {
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
  ): Promise<GreenButtonResponse | undefined> {
    return await this.getGreenButtonEndpoint(
      `/Batch/Subscription/${authorizationId}/UsagePoint/${meterId}`,
      formatDateTimeFiltersParameters(dateTimeFilters)
    )
  }

  async getServiceStatus(): Promise<GreenButtonResponse | undefined> {
    return await this.getGreenButtonEndpoint('/ReadServiceStatus')
  }

  async getApplicationInformation(
    appId: string
  ): Promise<GreenButtonResponse | undefined> {
    return await this.getGreenButtonEndpoint(`/ApplicationInformation/${appId}`)
  }
}

export type { types } from '@cityssm/green-button-parser'
export { helpers } from '@cityssm/green-button-parser'
