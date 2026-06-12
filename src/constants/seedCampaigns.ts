import type { Campaign } from '../types/campaign'

export const SEED_CAMPAIGNS: Campaign[] = [
  {
    id: 'c1a2b3c4-0001-4a1b-8c2d-000000000001',
    name: 'Summer Sneakers Promo',
    keywords: ['shoes', 'sneakers', 'running'],
    bidAmount: 1.5,
    campaignFund: 500,
    status: 'on',
    town: 'Warszawa',
    radius: 25,
  },
  {
    id: 'c1a2b3c4-0002-4a1b-8c2d-000000000002',
    name: 'Winter Jackets Clearance',
    keywords: ['jackets', 'winter', 'outerwear'],
    bidAmount: 0.8,
    campaignFund: 300,
    status: 'off',
    town: 'Kraków',
    radius: 50,
  },
  {
    id: 'c1a2b3c4-0003-4a1b-8c2d-000000000003',
    name: 'Smartphone Launch',
    keywords: ['smartphone', 'electronics', '5G'],
    bidAmount: 2.25,
    campaignFund: 1200,
    status: 'on',
    town: 'Gdańsk',
    radius: 100,
  },
]
