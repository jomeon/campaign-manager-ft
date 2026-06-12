import type { Campaign, CampaignInput } from '../types/campaign'
import { SEED_CAMPAIGNS } from '../constants/seedCampaigns'

const STORAGE_KEY = 'campaign-manager:campaigns:v2'
const LATENCY_MS = 250

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function read(): Campaign[] {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (raw === null) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_CAMPAIGNS))
    return [...SEED_CAMPAIGNS]
  }
  try {
    return JSON.parse(raw) as Campaign[]
  } catch {
    return []
  }
}

function write(campaigns: Campaign[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(campaigns))
}

export const campaignsApi = {
  list: async (): Promise<Campaign[]> => {
    await delay(LATENCY_MS)
    return read()
  },

  create: async (campaign: Campaign): Promise<Campaign> => {
    await delay(LATENCY_MS)
    const campaigns = read()
    write([campaign, ...campaigns])
    return campaign
  },

  update: async (id: string, input: CampaignInput): Promise<Campaign> => {
    await delay(LATENCY_MS)
    const updated: Campaign = { ...input, id }
    write(read().map((c) => (c.id === id ? updated : c)))
    return updated
  },

  patch: async (id: string, partial: Partial<Campaign>): Promise<Campaign> => {
    await delay(LATENCY_MS)
    let result: Campaign | undefined
    write(
      read().map((c) => {
        if (c.id !== id) return c
        result = { ...c, ...partial }
        return result
      })
    )
    return result as Campaign
  },

  remove: async (id: string): Promise<void> => {
    await delay(LATENCY_MS)
    write(read().filter((c) => c.id !== id))
  },
}
