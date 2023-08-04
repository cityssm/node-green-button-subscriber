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

export interface Configuration {
  baseUrl: `${string}/`
  clientId?: string
  clientSecret?: string
  accessToken?: string
}

let _configuration: Configuration
let _token: {
  access_token: string
  expires_in: number
}

export function setConfiguration(configuration: Configuration): void {
  _configuration = configuration
}

export function setUtilityApiConfiguration(
  apiToken: string,
  baseUrl: `${string}/` = 'https://utilityapi.com/'
): void {
  setConfiguration({
    baseUrl,
    accessToken: apiToken
  })
}

async function getAccessToken(): Promise<void> {
  if (_configuration.accessToken !== undefined) {
    _token = {
      access_token: _configuration.accessToken,
      expires_in: Number.POSITIVE_INFINITY
    }
    return
  }

  try {
    const authorizeUrl = `${_configuration.baseUrl}oauth/authorize`

    debug(`Authorize URL: ${authorizeUrl}`)

    const response = await axios.post(
      authorizeUrl,
      {
        response_type: 'code',
        grant_type: 'client_credentials',
        client_id: _configuration.clientId,
        client_secret: _configuration.clientSecret
      },
      {
        headers: {
          Referer: _configuration.baseUrl
        }
      }
    )

    _token = response.data

    debug('Access token obtained successfully.')
    debug('Access Token:', _token.access_token)
  } catch (error) {
    debug('Error getting access token:', error.response.data)
  }
}

export async function getEndpoint(
  endpoint: string,
  getParameters: Record<string, string> = {}
): Promise<string | undefined> {
  if (_token === undefined || Date.now() >= _token.expires_in * 1000) {
    // If the token is not obtained or has expired, get a new one
    debug('Token expired.')
    await getAccessToken()
  }

  // Set the access token in the request headers
  const headers = {
    Authorization: `Bearer ${_token.access_token}`
  }

  const apiEndpoint = _configuration.baseUrl + endpoint
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

export async function getGreenButtonEndpoint(
  greenButtonEndpoint: `/${string}`,
  getParameters?: Record<string, string>
): Promise<greenButtonTypes.GreenButtonJson | undefined> {
  const greenButtonXml = await getEndpoint(
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
export async function getAuthorizations(): Promise<
  greenButtonTypes.GreenButtonJson | undefined
> {
  return await getGreenButtonEndpoint('/Authorization')
}

/**
 * Get a specific customer authorization.
 * @param authorizationId
 * @returns GreenButtonJson with Authorization content entries.
 */
export async function getAuthorization(
  authorizationId: string
): Promise<greenButtonTypes.GreenButtonJson | undefined> {
  return await getGreenButtonEndpoint(`/Authorization/${authorizationId}`)
}

/**
 * Get a list of Usage Points.
 * @param authorizationId
 * @returns GreenButtonJson with UsagePoint content entries.
 */
export async function getUsagePoints(
  authorizationId: string
): Promise<greenButtonTypes.GreenButtonJson | undefined> {
  return await getGreenButtonEndpoint(
    `/Subscription/${authorizationId}/UsagePoint`
  )
}

/**
 * Get a list of Meter Readings.
 * @param authorizationId
 * @param meterId
 * @returns GreenButtonJson with MeterReading content entries.
 */
export async function getMeterReadings(
  authorizationId: string,
  meterId: string
): Promise<greenButtonTypes.GreenButtonJson | undefined> {
  return await getGreenButtonEndpoint(
    `/Subscription/${authorizationId}/UsagePoint/${meterId}/MeterReading`
  )
}

/**
 * Get a list of Interval Blocks.
 * @param authorizationId
 * @returns GreenButtonJson with MeterReading content entries.
 */
export async function getIntervalBlocks(
  authorizationId: string,
  meterId: string,
  readingId: string
): Promise<greenButtonTypes.GreenButtonJson | undefined> {
  return await getGreenButtonEndpoint(
    `/Subscription/${authorizationId}/UsagePoint/${meterId}/MeterReading/${readingId}/IntervalBlock`
  )
}

/**
 * Get a list of Usage Summaries.
 * @param authorizationId
 * @param meterId
 * @returns GreenButtonJson with UsageSummary content entries.
 */
export async function getUsageSummaries(
  authorizationId: string,
  meterId: string
): Promise<greenButtonTypes.GreenButtonJson | undefined> {
  return await getGreenButtonEndpoint(
    `/Subscription/${authorizationId}/UsagePoint/${meterId}/UsageSummary`
  )
}

/**
 * Get a list of Electric Power Quaility Summaries.
 * @param authorizationId
 * @param meterId
 * @returns GreenButtonJson with ElectricPowerQualitySummary content entries.
 */
export async function getElectricPowerQualitySummaries(
  authorizationId: string,
  meterId: string
): Promise<greenButtonTypes.GreenButtonJson | undefined> {
  return await getGreenButtonEndpoint(
    `/Subscription/${authorizationId}/UsagePoint/${meterId}/ElectricPowerQualitySummary`
  )
}

export async function getCustomers(
  authorizationId: string
): Promise<greenButtonTypes.GreenButtonJson | undefined> {
  return await getGreenButtonEndpoint(
    `/RetailCustomer/${authorizationId}/Customer`
  )
}

export async function getCustomerAccounts(
  authorizationId: string,
  customerId: string
): Promise<greenButtonTypes.GreenButtonJson | undefined> {
  return await getGreenButtonEndpoint(
    `/RetailCustomer/${authorizationId}/Customer/${customerId}/CustomerAccount`
  )
}

export async function getCustomerAgreements(
  authorizationId: string,
  customerId: string,
  customerAccountId: string
): Promise<greenButtonTypes.GreenButtonJson | undefined> {
  return await getGreenButtonEndpoint(
    `/RetailCustomer/${authorizationId}/Customer/${customerId}/CustomerAccount/${customerAccountId}/CustomerAgreement`
  )
}

/**
 * Get all data (usage points, usage summaries, interval blocks, etc.)
 * for a specific Authorization
 * @param authorizationId
 * @returns
 */
export async function getBatchSubscriptionsByAuthorization(
  authorizationId: string,
  dateTimeFilters?: DateTimeFilters
): Promise<greenButtonTypes.GreenButtonJson | undefined> {
  return await getGreenButtonEndpoint(
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
export async function getBatchSubscriptionsByMeter(
  authorizationId: string,
  meterId: string,
  dateTimeFilters?: DateTimeFilters
): Promise<greenButtonTypes.GreenButtonJson | undefined> {
  return await getGreenButtonEndpoint(
    `/Batch/Subscription/${authorizationId}/UsagePoint/${meterId}`,
    formatDateTimeFiltersParameters(dateTimeFilters)
  )
}

export default {
  setConfiguration,
  setUtilityApiConfiguration,
  getEndpoint,
  getGreenButtonEndpoint,
  getAuthorizations,
  getAuthorization,
  getUsagePoints,
  getMeterReadings,
  getIntervalBlocks,
  getUsageSummaries,
  getElectricPowerQualitySummaries,
  getCustomers,
  getCustomerAccounts,
  getCustomerAgreements,
  getBatchSubscriptionsByAuthorization,
  getBatchSubscriptionsByMeter
}

export type * as types from '@cityssm/green-button-parser/types/entryTypes.js'
