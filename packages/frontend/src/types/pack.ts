import type { BrandId, SegmentId } from './segment'
import type { RetailerGroupId } from './retailer'

export interface PackPriceEntry {
  brandId: BrandId
  segmentId: SegmentId
  subline: string
  packCount: number
  unitSizeG: number
  unitPriceEur: number
  pricePerKgEur: number
  isIdeal: boolean           // current vs ideal world
  recommendation?: string
}

export interface SKUShareValue {
  segmentId: SegmentId
  channelOrRetailer: string
  skuSharePct: number        // % of total SKUs
  valueSharePct: number      // % of total value sales
  ratio: number              // skuShare / valueShare — >100 = over-represented, <100 = under-represented
  projected3Y?: number       // ratio projected in 3 years
}

export interface AssortmentRecommendation {
  retailerId: RetailerGroupId
  retailerFormat: string
  segmentId: SegmentId
  actualSkuCount: number
  fairShareSkuCount: number
  listingOpps: number        // positive = room to grow
  newListings: number        // recommended new listings
  action: 'expand' | 'maintain' | 'rationalize'
}

export interface GrandTotalAssortment {
  retailerId: RetailerGroupId
  retailerFormat: string
  actualTotal: number
  fairShareTotal: number
  totalListingOpps: number
  totalNewListings: number
}
