# Green Button Subscriber

[![npm (scoped)](https://img.shields.io/npm/v/%40cityssm/green-button-subscriber)](https://www.npmjs.com/package/@cityssm/green-button-subscriber)
[![DeepSource](https://app.deepsource.com/gh/cityssm/node-green-button-subscriber.svg/?label=active+issues&show_trend=true&token=9oj_5qvTuBqQRgbaUdjUnjOv)](https://app.deepsource.com/gh/cityssm/node-green-button-subscriber/?ref=repository-badge)
[![Maintainability](https://api.codeclimate.com/v1/badges/d7942562aa48a93c896b/maintainability)](https://codeclimate.com/github/cityssm/node-green-button-subscriber/maintainability)

Handles the OAuth authentication, downloading, and parsing of Green Button API data.

❗ _Currently only testing with [UtilityAPI's Green Button implementation](https://utilityapi.com/docs/greenbutton)._

## Installation

```bash
npm install @cityssm/green-button-subscriber
```

## Usage

⭐ All output is parsed and returned a fully typed object. ⭐

```javascript
import * as greenButtonSubscriber from '@cityssm/green-button-subscriber'

// Pass the base URL, client ID, client secret, etc.
greenButtonSubscriber.setConfiguration(config)

// Get the authorizations
const greenButtonJson = await greenButtonSubscriber.getAuthorizations()
```

## Just Looking to Parse Green Button XML?

Check out
[@cityssm/green-button-parser](https://www.npmjs.com/package/@cityssm/green-button-parser).
