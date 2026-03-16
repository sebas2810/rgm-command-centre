export interface PLLine {
  volumeK: number
  grossRevenueM: number
  tradeSpendM: number
  netRevenueM: number
  cogsM: number
  grossProfitM: number
  grossMarginPct: number
}

export interface PLComparison {
  baseline: PLLine
  impacted: PLLine
  scenario?: PLLine
}

export interface WaterfallStep {
  label: string
  value: number  // in millions EUR
  type: 'increase' | 'decrease' | 'subtotal'
  color?: string
}
