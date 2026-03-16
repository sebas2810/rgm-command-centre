export type RetailerId = 'carrefour-hyper' | 'carrefour-super' | 'ahorramas' | 'mercadona' | 'discounters'
export type RetailerGroupId = 'carrefour' | 'ahorramas' | 'mercadona' | 'discounters'
export type ChannelType = 'Hyper' | 'Super' | 'Regional Super' | 'Discounter'

export interface Retailer {
  id: RetailerId
  groupId: RetailerGroupId
  name: string
  displayName: string
  channelType: ChannelType
  logoColor: string
  marketSharePct: number
  yogurtSharePct: number
  relationshipScore: number  // 1-10
  negotiationStatus: 'Strong' | 'Neutral' | 'Strained'
  keyConstraints: string[]
  skuCount: number
  fairShareSkuCount: number
}

export interface RetailerPerformance {
  retailerId: RetailerGroupId
  volumeIx: number         // index vs plan (100 = on plan)
  netSalesIx: number
  salesMarginIx: number
  salesMarginDeltaPp: number
  tradeMarginIx: number
  tradeMarginDeltaPp: number
  status: 'on-track' | 'at-risk' | 'off-track'
}
