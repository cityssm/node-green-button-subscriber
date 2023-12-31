# Green Button® Subscriber for Node

[![npm (scoped)](https://img.shields.io/npm/v/%40cityssm/green-button-subscriber)](https://www.npmjs.com/package/@cityssm/green-button-subscriber)
[![DeepSource](https://app.deepsource.com/gh/cityssm/node-green-button-subscriber.svg/?label=active+issues&show_trend=true&token=9oj_5qvTuBqQRgbaUdjUnjOv)](https://app.deepsource.com/gh/cityssm/node-green-button-subscriber/?ref=repository-badge)
[![Maintainability](https://api.codeclimate.com/v1/badges/d7942562aa48a93c896b/maintainability)](https://codeclimate.com/github/cityssm/node-green-button-subscriber/maintainability)

Handles the OAuth authentication, downloading, and parsing of Green Button® data.

## Important Notes

This code is for use with the
[Green Button Connect My Data® (CMD) standard](https://www.greenbuttonalliance.org/green-button-connect-my-data-cmd).
Before it can be used with your utility company, you may have to undergo
a registration and approval process with that utility company to be formerly
registered as a third party solution provider.

❗ _Due to the extensive registration process
and the need to be a customer with the utility company to access data,
this module is currently only tested with
[UtilityAPI's Green Button® CMD implementation](https://utilityapi.com/docs/greenbutton)._

## Installation

```bash
npm install @cityssm/green-button-subscriber
```

## Usage

⭐ All output is parsed and returned as a fully typed object. ⭐

```javascript
import { GreenButtonSubscriber } from '@cityssm/green-button-subscriber'

const configuration = {
  baseUrl: 'https://greenbutton.example.com/',
  accessToken: '0123456789abcdef'
}

// Pass the base URL, client ID, client secret, etc.
const greenButtonSubscriber = new GreenButtonSubscriber(configuration)

// Get the authorizations
const greenButtonResponse = await greenButtonSubscriber.getAuthorizations()
```

## Related Projects

If you are looking to parse Green Button® XML data downloaded from a utility provider
using the [Green Button Download My Data® (DMD) standard](https://www.greenbuttonalliance.org/green-button-download-my-data-dmd), see the
[City of Sault Ste. Marie's Green Button® Parser](https://github.com/cityssm/node-green-button-parser).

If you are looking for a full application to report on energy usage,
see [EMILE (Energy Monitoring in Less Effort)](https://github.com/cityssm/EMILE).

## Trademarks

® GREEN BUTTON is a registered trademark owned by Departments of the U.S. Government.

The City of Sault Ste. Marie is a [Liaison member of the Green Button Alliance](https://www.greenbuttonalliance.org/members/sault-ste-marie).
