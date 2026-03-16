import type { PlanActual } from '../../types/plan'
import type { SegmentId } from '../../types/segment'
import type { RetailerGroupId } from '../../types/retailer'

// Planned targets per segment (from annual-plan.ts)
const segmentPlans: Record<SegmentId, { volIx: number; nsIx: number; smIx: number; smPp: number; tmIx: number; tmPp: number }> = {
  'bifidus':        { volIx: 103, nsIx: 105, smIx: 110, smPp: 2.8, tmIx: 104, tmPp: 0.5 },
  'greek':          { volIx: 104, nsIx: 107, smIx: 114, smPp: 3.6, tmIx: 108, tmPp: 0.9 },
  'protein':        { volIx: 108, nsIx: 112, smIx: 118, smPp: 4.2, tmIx: 110, tmPp: 1.1 },
  'essentials-kids': { volIx: 100, nsIx: 102, smIx: 111, smPp: 2.9, tmIx: 105, tmPp: 0.6 },
  'kefir':          { volIx: 106, nsIx: 108, smIx: 115, smPp: 3.5, tmIx: 107, tmPp: 0.8 },
  'immunity':       { volIx: 102, nsIx: 105, smIx: 113, smPp: 3.3, tmIx: 106, tmPp: 0.7 },
  'cholesterol':    { volIx: 99,  nsIx: 101, smIx: 109, smPp: 2.4, tmIx: 104, tmPp: 0.5 },
  'plant-based':    { volIx: 110, nsIx: 113, smIx: 119, smPp: 4.5, tmIx: 112, tmPp: 1.3 },
  'light':          { volIx: 97,  nsIx: 100, smIx: 108, smPp: 2.1, tmIx: 103, tmPp: 0.4 },
  'kids':           { volIx: 102, nsIx: 104, smIx: 112, smPp: 3.1, tmIx: 106, tmPp: 0.7 },
}

const retailers: RetailerGroupId[] = ['carrefour', 'ahorramas', 'mercadona', 'discounters']
const segments: SegmentId[] = ['bifidus', 'greek', 'protein', 'essentials-kids', 'kefir', 'immunity', 'cholesterol', 'plant-based', 'light', 'kids']

// Small deterministic offsets per retailer to create natural variation
const retailerOffsets: Record<RetailerGroupId, { vol: number; ns: number; sm: number; smPp: number; tm: number; tmPp: number }> = {
  'carrefour':   { vol: 1,  ns: 1,  sm: 2,  smPp: 0.2, tm: 1,  tmPp: 0.1 },
  'ahorramas':   { vol: 0,  ns: -1, sm: 0,  smPp: 0.0, tm: 0,  tmPp: 0.0 },
  'mercadona':   { vol: -1, ns: 1,  sm: 1,  smPp: 0.1, tm: 1,  tmPp: 0.1 },
  'discounters': { vol: 1,  ns: -1, sm: -1, smPp: -0.1, tm: -2, tmPp: -0.1 },
}

// Override map for specific deviations
type DeviationKey = `${SegmentId}|${RetailerGroupId}`
const overrides: Partial<Record<DeviationKey, Partial<PlanActual>>> = {
  'bifidus|carrefour': {
    volumeIx: 89,
    netSalesIx: 91,
    salesMarginIx: 102,
    salesMarginDeltaPp: 0.6,
    tradeMarginIx: 96,
    tradeMarginDeltaPp: -0.4,
  },
  'bifidus|mercadona': {
    volumeIx: 92,
    netSalesIx: 88,
    salesMarginIx: 104,
    salesMarginDeltaPp: 1.1,
    tradeMarginIx: 98,
    tradeMarginDeltaPp: -0.2,
  },
  'greek|ahorramas': {
    salesMarginIx: 108,
    salesMarginDeltaPp: 2.1,
  },
  'kefir|mercadona': {
    netSalesIx: 95,
    salesMarginIx: 108,
    salesMarginDeltaPp: 2.0,
  },
  'immunity|discounters': {
    volumeIx: 85,
    netSalesIx: 88,
    salesMarginIx: 105,
    salesMarginDeltaPp: 1.4,
    tradeMarginIx: 96,
    tradeMarginDeltaPp: -0.3,
  },
  // Positive deviations
  'plant-based|carrefour': {
    volumeIx: 118,
    netSalesIx: 121,
    salesMarginIx: 125,
    salesMarginDeltaPp: 5.8,
    tradeMarginIx: 117,
    tradeMarginDeltaPp: 1.8,
  },
  'protein|carrefour': {
    volumeIx: 114,
    netSalesIx: 118,
    salesMarginIx: 124,
    salesMarginDeltaPp: 5.4,
    tradeMarginIx: 115,
    tradeMarginDeltaPp: 1.6,
  },
  'protein|mercadona': {
    volumeIx: 112,
    netSalesIx: 116,
    salesMarginIx: 122,
    salesMarginDeltaPp: 5.0,
    tradeMarginIx: 113,
    tradeMarginDeltaPp: 1.4,
  },
}

function generateActuals(): PlanActual[] {
  const actuals: PlanActual[] = []

  for (const seg of segments) {
    for (const ret of retailers) {
      const plan = segmentPlans[seg]
      const offset = retailerOffsets[ret]
      const key: DeviationKey = `${seg}|${ret}`
      const override = overrides[key]

      const base: PlanActual = {
        segmentId: seg,
        retailerId: ret,
        volumeIx: plan.volIx + offset.vol,
        netSalesIx: plan.nsIx + offset.ns,
        salesMarginIx: plan.smIx + offset.sm,
        salesMarginDeltaPp: +(plan.smPp + offset.smPp).toFixed(1),
        tradeMarginIx: plan.tmIx + offset.tm,
        tradeMarginDeltaPp: +(plan.tmPp + offset.tmPp).toFixed(1),
      }

      if (override) {
        actuals.push({ ...base, ...override })
      } else {
        actuals.push(base)
      }
    }
  }

  return actuals
}

export const planActuals: PlanActual[] = generateActuals()
