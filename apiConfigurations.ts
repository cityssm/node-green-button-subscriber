// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/indent */

import type { GreenButtonSubscriberConfiguration } from './types.js'

export const apiConfigurations: Record<
  'enbridge' | 'utilityAPI',
  GreenButtonSubscriberConfiguration
> = Object.freeze({
  enbridge: {
    baseUrl: 'https://api.enbridgegas.com/',
    oauthUrl: 'https://api.enbridgegas.com/oauth2/default/v1/token'
  },
  utilityAPI: {
    baseUrl: 'https://utilityapi.com/DataCustodian/'
  }
})
