export type SegmentId =
  | 'bifidus'
  | 'greek'
  | 'protein'
  | 'essentials-kids'
  | 'kefir'
  | 'immunity'
  | 'cholesterol'
  | 'plant-based'
  | 'light'
  | 'kids'

export type BrandId =
  | 'activia'
  | 'oikos'
  | 'griego'
  | 'yopro'
  | 'proteina'
  | 'danone'
  | 'natillas'
  | 'actimel'
  | 'danacol'
  | 'alpro'
  | 'vitalinea'
  | 'danonino'

export type PricePosition = 'Premium' | 'Mid-Tier' | 'Low-Tier'
export type PriceLeadershipStatus = 'Leader' | 'Follower'
export type BrandRole = 'Turnaround' | 'Grow Share' | 'Fix Profitability' | 'Stabilize' | 'Accelerate' | 'Maximize'
export type ProfitRole = 'Profit Driver' | 'Revenue Driver' | 'Volume Driver' | 'Growth Driver' | 'Revenue & Profit Driver'

export interface Segment {
  id: SegmentId
  name: string
  wobPct: number          // Weight of Business %
  catSharePct: number     // Category share %
  catShareDeltaPp: number // vs YA in pp
  brandSharePct: number   // Danone brand share %
  gpPct: number           // Gross Profit %
  priceIndex: number      // Segment price index (Yogurt = 100)
  avgPricePerKg: number   // €
  valueSalesM: number     // €M annual
  yoyGrowthPct: number    // vs YA %
  parentGroup: 'Spoon' | 'Drink'
}

export interface Brand {
  id: BrandId
  name: string
  displayName: string
  segmentId: SegmentId
  pricePosition: PricePosition
  priceCorridor: string       // e.g. "190-200 vs PL"
  priceLeadership: PriceLeadershipStatus
  role: BrandRole
  profitRole: ProfitRole
  sharePct: number
  shareDeltaPp: number
  gpPct: number
  killerPricePoints: string   // e.g. "2, 3, 4€"
  strategy: string
  actions: string[]
  logoColor: string           // for UI
}

export interface SKU {
  id: string
  name: string
  brandId: BrandId
  segmentId: SegmentId
  packCount: number       // e.g. 4
  unitSizeG: number       // grams per unit
  unitPriceEur: number    // price per pack
  pricePerKgEur: number   // €/kg
  gpPct: number
  valueSalesK: number     // €K annual
  volumeSharePct: number
  isCore: boolean         // core vs tail SKU
}

export interface Competitor {
  id: string
  name: string
  isPrivateLabel: boolean
  retailerId?: string     // e.g. 'mercadona' for Hacendado
  revenueIndex: number    // consumer willingness to pay (100 = baseline)
  segments: SegmentId[]
  pricePosition: PricePosition
}
