import type { SegmentId } from './segment'
import type { RetailerGroupId } from './retailer'

export type PlanStatus = 'on-track' | 'at-risk' | 'off-track'
export type DeviationSeverity = 'critical' | 'warning' | 'minor' | 'none'
export type RootCauseType = 'internal-execution' | 'internal-promo' | 'external-competitor' | 'external-market' | 'external-cost'

export interface AnnualPlan {
  year: number
  category: string
  market: string
  overallKPIs: PlanKPIs
  segmentTargets: SegmentTarget[]
  retailerTargets: RetailerTarget[]
  buildingBlocks: BuildingBlock[]
  status: PlanStatus
}

export interface PlanKPIs {
  volumeIx: number          // e.g. 101 = +1% vs prior year
  netSalesIx: number        // e.g. 104
  netSalesDeltaM: number    // +€xx.8M
  netSalesPerKgDelta: number // NS/kg +2.7%
  salesMarginIx: number     // e.g. 113
  salesMarginDeltaM: number // +€xx.3M
  salesMarginDeltaPp: number // SM% +3.3pts
  tradeMarginIx: number     // e.g. 106
  tradeMarginDeltaM: number // +€xx.1M
  tradeMarginDeltaPp: number // TM% +0.7pts
}

export interface SegmentTarget {
  segmentId: SegmentId
  volumeIx: number
  netSalesIx: number
  salesMarginIx: number
  salesMarginDeltaPp: number
  tradeMarginIx: number
  tradeMarginDeltaPp: number
  status: PlanStatus
}

export interface RetailerTarget {
  retailerId: RetailerGroupId
  volumeIx: number
  netSalesIx: number
  salesMarginIx: number
  salesMarginDeltaPp: number
  tradeMarginIx: number
  tradeMarginDeltaPp: number
  status: PlanStatus
}

export interface BuildingBlock {
  id: string
  label: string
  valuePp: number       // contribution in percentage points
  valueM: number        // contribution in €M
  type: 'increase' | 'decrease' | 'subtotal'
  color: string
  description: string
}

export interface Deviation {
  id: string
  segmentId: SegmentId
  retailerId?: RetailerGroupId
  metric: string
  planned: number
  actual: number
  gapPct: number
  gapAbsolute: number
  severity: DeviationSeverity
  rootCause: RootCauseType
  rootCauseDetail: string
  detectedDate: string
  trending: 'improving' | 'stable' | 'worsening'
  recommendedAction?: string
}

export interface PlanActual {
  segmentId: SegmentId
  retailerId: RetailerGroupId
  volumeIx: number
  netSalesIx: number
  salesMarginIx: number
  salesMarginDeltaPp: number
  tradeMarginIx: number
  tradeMarginDeltaPp: number
}
