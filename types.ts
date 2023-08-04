export type IsoDateString =
  `${string}-${string}-${string}T${string}:${string}:${string}Z`

export type DateOrIsoDateString = Date | IsoDateString

export interface DateTimeFilters {
  publishedMin?: DateOrIsoDateString
  publishedMax?: DateOrIsoDateString
  updatedMin?: DateOrIsoDateString
  updatedMax?: DateOrIsoDateString
}
