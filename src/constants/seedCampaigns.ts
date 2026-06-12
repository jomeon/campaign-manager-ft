import type { Campaign } from '../types/campaign'
import { TOWNS } from './towns'
import { KEYWORD_SUGGESTIONS } from './keywords'

const FEATURED: Campaign[] = [
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

const PRODUCTS = [
  'Sneakers',
  'Running Shoes',
  'Winter Jacket',
  'Smartphone',
  'Laptop',
  'Headphones',
  'Coffee Maker',
  'Backpack',
  'Sunglasses',
  'Smartwatch',
  'Desk Lamp',
  'Office Chair',
  'Yoga Mat',
  'Water Bottle',
  'Cookware Set',
  'Board Game',
  'Skincare Kit',
  'Perfume',
  'Garden Tools',
  'Bicycle',
]

const TYPES = ['Promo', 'Sale', 'Launch', 'Clearance', 'Bundle', 'Flash Deal']

const at = <T,>(arr: readonly T[], i: number): T => arr[i % arr.length]

function keywordsFor(i: number): string[] {
  const count = 2 + (i % 3)
  const out: string[] = []
  for (let k = 0; k < count; k++) out.push(KEYWORD_SUGGESTIONS[(i * 3 + k) % KEYWORD_SUGGESTIONS.length])
  return Array.from(new Set(out))
}

// Deterministically generated so the seeded list is stable across reloads.
const GENERATED: Campaign[] = Array.from({ length: 117 }, (_, idx) => {
  const i = idx + 1
  return {
    id: `seed-${i}`,
    name: `${at(PRODUCTS, i)} ${at(TYPES, i * 3)} #${i}`,
    keywords: keywordsFor(i),
    bidAmount: Math.round((0.2 + (i % 25) * 0.1) * 100) / 100,
    campaignFund: 50 + (i % 20) * 75,
    status: i % 3 === 0 ? 'off' : 'on',
    town: at(TOWNS, i),
    radius: 5 + (i % 20) * 5,
  }
})

export const SEED_CAMPAIGNS: Campaign[] = [...FEATURED, ...GENERATED]
