import type { BrandId } from './segment'
import type { RetailerGroupId } from './retailer'

export interface PriceCorridor {
  brandId: BrandId
  pricePosition: string
  corridorRange: string        // e.g. "190-200 vs PL"
  currentPriceIndex: number    // current price index
  targetPriceIndex: number     // optimal price index
  isInCorridor: boolean
  rationale: string
}

export interface PriceLeadershipEntry {
  brandId: BrandId
  segment: string
  pricePosition: string
  priceCorridor: string
  priceLeadership: string
  segmentLeadership: string
  pricingPower: string
  lowElasticity: boolean
  killerPricePoints: string
  marginPct: number
  criteriaMetCount: number
  totalCriteria: number
}

export interface RetailerPricing {
  brandId: BrandId
  retailerId: RetailerGroupId
  currentIndex: number
  recommendedIndex: number
  competitiveness: 'Uncompetitive' | 'Competitive' | 'Over-competitive'
  rationale: string
}

export interface CrossElasticityEntry {
  brandId: BrandId
  retailerId: RetailerGroupId
  priceUpRetention: number    // Y-axis: what happens when priced up 15%
  priceDownAppeal: number     // X-axis: what happens when priced down 10%
  quadrant: 'high-ret-high-appeal' | 'high-ret-low-appeal' | 'low-ret-high-appeal' | 'low-ret-low-appeal'
}

export interface AttributeImportance {
  attribute: string
  importancePct: number
  insight: string
}

export interface BrandRevenueIndex {
  brandId: string
  brandName: string
  revenueIndex: number    // 100 = baseline
  isPrivateLabel: boolean
}
