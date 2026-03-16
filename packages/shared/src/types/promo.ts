import type { BrandId, SegmentId } from './segment'
import type { RetailerGroupId } from './retailer'

export type PromoMechanicType = '2nd-50pct' | 'bogof' | 'tpr-10-20' | 'tpr-25-35' | 'tpr-40plus' | 'multi-buy' | 'loyalty' | 'sampling'

export interface PromoEfficiency {
  brandId: BrandId
  retailerId: RetailerGroupId
  promoValueSalesK: number   // €K
  vsodPct: number            // Volume Sold on Deal %
  vsodEvolutionPct: number   // vs YA %
  valueUpliftPct: number     // vs YA %
  isEfficient: boolean
}

export interface PromoMechanicStats {
  mechanic: PromoMechanicType
  label: string
  avgValueUpliftPct: number
  medianValueUpliftPct: number
  q1: number
  q3: number
  min: number
  max: number
  avgEfficiencyPct: number   // incremental sales / promo event cost
  medianEfficiency: number
  sampleSize: number
}

export interface PromoRecommendation {
  retailerId: RetailerGroupId
  area: 'Price Points' | 'Depth Of Deal' | 'Mechanics' | 'Frequency' | 'Seasonality' | 'Visibility'
  recommendation: string
  impact: string
}

export interface PromoCalendarEvent {
  id: string
  brandId: BrandId
  segmentId: SegmentId
  retailerId: RetailerGroupId
  mechanic: PromoMechanicType
  mechanicLabel: string
  startWeek: number
  endWeek: number
  discountPct: number
  expectedUpliftPct: number
  estimatedValueK: number
  isOptimized: boolean       // original vs optimized plan
  conflictFlag?: string
}
