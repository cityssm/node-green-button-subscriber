/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/indent */

import type { GreenButtonJson } from '@cityssm/green-button-parser/types/entryTypes'

export type IsoDateString =
  `${string}-${string}-${string}T${string}:${string}:${string}Z`

export type DateOrIsoDateString = Date | IsoDateString

export interface DateTimeFilters {
  publishedMin?: DateOrIsoDateString
  publishedMax?: DateOrIsoDateString
  updatedMin?: DateOrIsoDateString
  updatedMax?: DateOrIsoDateString
}

export type GreenButtonResponse =
  | {
      status: 200
      json: GreenButtonJson
    }
  | {
      status: number
      json?: GreenButtonJson
    }
