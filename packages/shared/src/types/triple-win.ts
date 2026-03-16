export interface TripleWinScore {
  consumer: TripleWinDimension
  manufacturer: TripleWinDimension
  retailer: TripleWinDimension
  overall: number  // 0-100
}

export interface TripleWinDimension {
  score: number  // 0-100
  label: string  // "Strong" | "Moderate" | "At Risk"
  factors: { name: string; impact: 'positive' | 'neutral' | 'negative'; detail: string }[]
}
