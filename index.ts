// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/indent */

import { atomToGreenButtonJson } from '@cityssm/green-button-parser'
// eslint-disable-next-line n/no-missing-import
import type { GreenButtonJson } from '@cityssm/green-button-parser/types/entryTypes.js'
import axios from 'axios'
import Debug from 'debug'

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
    const authorizeUrl = _configuration.baseUrl + 'oauth/authorize'

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
  endpoint: string
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

  // Replace 'YOUR_API_ENDPOINT' with the actual API endpoint you want to access
  const apiEndpoint = _configuration.baseUrl + endpoint

  debug(`End Point: ${apiEndpoint}`)

  try {
    const response = await axios.get(apiEndpoint, { headers })

    return response.data
  } catch (error) {
    debug('Error accessing API endpoint:', error.response.data)
  }
}

export async function getGreenButtonEndpoint(
  greenButtonEndpoint: `/${string}`
): Promise<GreenButtonJson | undefined> {
  const greenButtonXml = await getEndpoint(
    'DataCustodian/espi/1_1/resource' + greenButtonEndpoint
  )

  if (greenButtonXml === undefined) {
    return undefined
  }

  return await atomToGreenButtonJson(greenButtonXml)
}

export async function getAuthorizations(): Promise<
  GreenButtonJson | undefined
> {
  return await getGreenButtonEndpoint('/Authorization')
}

export async function getCustomers(
  authorizationId: string
): Promise<GreenButtonJson | undefined> {
  return await getGreenButtonEndpoint(
    `/RetailCustomer/${authorizationId}/Customer`
  )
}

export async function getCustomerAccounts(
  authorizationId: string,
  customerId: string
): Promise<GreenButtonJson | undefined> {
  return await getGreenButtonEndpoint(
    `/RetailCustomer/${authorizationId}/Customer/${customerId}/CustomerAccount`
  )
}

export async function getCustomerAgreements(
  authorizationId: string,
  customerId: string,
  customerAccountId: string
): Promise<GreenButtonJson | undefined> {
  return await getGreenButtonEndpoint(
    `/RetailCustomer/${authorizationId}/Customer/${customerId}/CustomerAccount/${customerAccountId}/CustomerAgreement`
  )
}

/**
 * Get a feed with all data (usage points, usage summaries, interval blocks, etc.)
 * @param authorizationId
 * @returns
 */
export async function getBatchSubscriptions(
  authorizationId: string
): Promise<GreenButtonJson | undefined> {
  return await getGreenButtonEndpoint(`/Batch/Subscription/${authorizationId}`)
}
