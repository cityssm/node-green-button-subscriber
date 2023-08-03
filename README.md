# Green Button Subscriber

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
