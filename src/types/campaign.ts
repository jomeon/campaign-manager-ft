import { z } from 'zod'

export const MIN_BID = 0.01
export const MAX_RADIUS = 500
export const MAX_KEYWORDS = 20

const statusEnum = z.enum(['on', 'off'])
export const STATUS_OPTIONS = statusEnum.options
export type CampaignStatus = z.infer<typeof statusEnum>

const numberField = (requiredMessage: string) =>
  z.preprocess(
    (value) =>
      value === '' || value === null || value === undefined
        ? undefined
        : typeof value === 'number' && Number.isNaN(value)
          ? undefined
          : Number(value),
    z.number({ required_error: requiredMessage, invalid_type_error: requiredMessage })
  )

export const campaignSchema = z.object({
  name: z.string().trim().min(1, 'Campaign name is required'),
  keywords: z
    .array(z.string())
    .min(1, 'Add at least one keyword')
    .max(MAX_KEYWORDS, `Maximum ${MAX_KEYWORDS} keywords`),
  bidAmount: numberField('Bid amount is required').pipe(
    z.number().min(MIN_BID, `Minimum bid is ${MIN_BID} PLN`)
  ),
  campaignFund: numberField('Campaign fund is required').pipe(
    z.number().positive('Fund must be greater than 0')
  ),
  status: statusEnum,
  town: z.string().optional().default(''),
  radius: numberField('Radius is required').pipe(
    z
      .number()
      .positive('Radius must be greater than 0')
      .max(MAX_RADIUS, `Radius cannot exceed ${MAX_RADIUS} km`)
  ),
})

export type CampaignInput = z.infer<typeof campaignSchema>

export type Campaign = CampaignInput & { id: string }

export const emptyCampaign: CampaignInput = {
  name: '',
  keywords: [],
  bidAmount: undefined as unknown as number,
  campaignFund: undefined as unknown as number,
  status: 'off',
  town: '',
  radius: undefined as unknown as number,
}
