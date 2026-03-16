import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Helper: map group-level retailer IDs to actual retailer IDs
function mapRetailerId(id: string): string {
  if (id === 'carrefour') return 'carrefour-hyper'
  return id
}

async function main() {
  console.log('🌱 Seeding RGM Command Centre database...\n')

  // ─── Segments ──────────────────────────────────────────────
  console.log('  Segments...')
  const segments = [
    { id: 'bifidus', name: 'Bifidus', wobPct: 16, catSharePct: 16, catShareDeltaPp: -5.0, brandSharePct: 63.9, gpPct: 37.1, priceIndex: 131, avgPricePerKg: 4.72, valueSalesM: 297.4, yoyGrowthPct: -6, parentGroup: 'Spoon' },
    { id: 'greek', name: 'Greek', wobPct: 19, catSharePct: 19, catShareDeltaPp: 0.6, brandSharePct: 25.4, gpPct: 18.6, priceIndex: 92, avgPricePerKg: 2.75, valueSalesM: 356.1, yoyGrowthPct: 12, parentGroup: 'Spoon' },
    { id: 'protein', name: 'Protein', wobPct: 5, catSharePct: 5, catShareDeltaPp: 1.0, brandSharePct: 35.0, gpPct: 28.3, priceIndex: 193, avgPricePerKg: 5.77, valueSalesM: 100.4, yoyGrowthPct: 13, parentGroup: 'Spoon' },
    { id: 'essentials-kids', name: 'Essentials / Kids', wobPct: 30, catSharePct: 30, catShareDeltaPp: -0.5, brandSharePct: 27.3, gpPct: 16.4, priceIndex: 71, avgPricePerKg: 2.12, valueSalesM: 491.5, yoyGrowthPct: -2, parentGroup: 'Spoon' },
    { id: 'kefir', name: 'Kefir', wobPct: 4, catSharePct: 4, catShareDeltaPp: 1.9, brandSharePct: 10.5, gpPct: 10.5, priceIndex: 110, avgPricePerKg: 3.29, valueSalesM: 79.3, yoyGrowthPct: 34, parentGroup: 'Drink' },
    { id: 'immunity', name: 'Immunity', wobPct: 16, catSharePct: 16, catShareDeltaPp: 1.8, brandSharePct: 61.3, gpPct: 42.5, priceIndex: 107, avgPricePerKg: 3.21, valueSalesM: 187.0, yoyGrowthPct: -3, parentGroup: 'Drink' },
    { id: 'cholesterol', name: 'Cholesterol', wobPct: 3, catSharePct: 3, catShareDeltaPp: 1.0, brandSharePct: 88.7, gpPct: 50.0, priceIndex: 195, avgPricePerKg: 5.82, valueSalesM: 112.5, yoyGrowthPct: 6, parentGroup: 'Drink' },
    { id: 'plant-based', name: 'Plant-Based', wobPct: 5, catSharePct: 5, catShareDeltaPp: 5.0, brandSharePct: 76.3, gpPct: 27.5, priceIndex: 175, avgPricePerKg: 5.24, valueSalesM: 102.6, yoyGrowthPct: 24, parentGroup: 'Spoon' },
    { id: 'light', name: 'Light', wobPct: 2, catSharePct: 2, catShareDeltaPp: -2.0, brandSharePct: 27.1, gpPct: 27.1, priceIndex: 74, avgPricePerKg: 4.06, valueSalesM: 92.1, yoyGrowthPct: -11, parentGroup: 'Spoon' },
    { id: 'kids', name: 'Kids', wobPct: 3, catSharePct: 3, catShareDeltaPp: -1.2, brandSharePct: 25.2, gpPct: 25.2, priceIndex: 155, avgPricePerKg: 5.62, valueSalesM: 80.7, yoyGrowthPct: -2, parentGroup: 'Spoon' },
  ]
  for (const s of segments) {
    await prisma.segment.upsert({ where: { id: s.id }, update: s, create: s })
  }

  // ─── Brands ────────────────────────────────────────────────
  console.log('  Brands...')
  const brands = [
    { id: 'activia', name: 'activia', displayName: 'Activia', segmentId: 'bifidus', pricePosition: 'Mid-Tier', priceCorridor: '190-200 vs PL', priceLeadership: 'Follower', role: 'Turnaround', profitRole: 'Profit Driver', sharePct: 63.9, shareDeltaPp: -5.0, gpPct: 38.1, strategy: 'Stabilize volume decline through price repositioning and pack architecture renovation. Defend core 4-pack while growing single-serve occasion.', actions: ['Re-anchor 4x120g at \u20AC2.99 price point across all channels', 'Launch Activia Protein sub-line to capture cross-segment demand', 'Reduce tail SKUs by 15% to improve shelf productivity', 'Increase promo efficiency \u2014 shift from depth to frequency'], logoColor: '#00A650' },
    { id: 'oikos', name: 'oikos', displayName: 'Oikos', segmentId: 'greek', pricePosition: 'Premium', priceCorridor: '260-280 vs PL / 190-200 vs Griego', priceLeadership: 'Follower', role: 'Grow Share', profitRole: 'Revenue & Profit Driver', sharePct: 12.0, shareDeltaPp: 4.6, gpPct: 27.7, strategy: 'Accelerate premiumization of Greek segment. Leverage indulgence positioning to command price premium over Griego.', actions: ['Expand Oikos distribution in Carrefour Hyper from 8 to 12 SKUs', 'Launch limited-edition seasonal flavors to drive trial', 'Maintain 190-200 index vs Griego to justify premium positioning', 'Activate cross-merchandising with fresh fruit in key accounts'], logoColor: '#1A3668' },
    { id: 'griego', name: 'griego', displayName: 'Griego', segmentId: 'greek', pricePosition: 'Mid-Tier', priceCorridor: '120 vs PL', priceLeadership: 'Leader', role: 'Grow Share', profitRole: 'Volume Driver', sharePct: 13.4, shareDeltaPp: -2.3, gpPct: 22.3, strategy: 'Defend mid-tier Greek position against private label encroachment. Focus on value perception and pack size optimization.', actions: ['Introduce 500g family format at \u20AC2.49 to compete with PL', 'Strengthen Mercadona listing through promotional calendar alignment', 'Optimize flavor portfolio \u2014 exit low-rotation exotic variants', 'Invest in on-shelf visibility through branded shelf trays'], logoColor: '#4A90D9' },
    { id: 'yopro', name: 'yopro', displayName: 'YoPRO', segmentId: 'protein', pricePosition: 'Premium', priceCorridor: '130-140 vs PL / 160-180 vs D.Proteina', priceLeadership: 'Follower', role: 'Accelerate', profitRole: 'Growth Driver', sharePct: 35.0, shareDeltaPp: -7.6, gpPct: 28.4, strategy: 'Defend premium protein positioning against new entrants. Expand beyond fitness occasion into everyday health.', actions: ['Launch YoPRO Skyr sub-range to capture Nordic trend', 'Increase convenience channel penetration (gas stations, gyms)', 'Protect 160-180 index vs Proteina through innovation premiums', 'Partner with fitness influencers for digital-first campaigns'], logoColor: '#E63946' },
    { id: 'proteina', name: 'proteina', displayName: 'Proteina', segmentId: 'protein', pricePosition: 'Mid-Tier', priceCorridor: '<5\u20AC/kg', priceLeadership: 'Follower', role: 'Stabilize', profitRole: 'Volume Driver', sharePct: 8.2, shareDeltaPp: -1.1, gpPct: 18.5, strategy: 'Provide accessible protein entry point. Avoid direct price competition with PL.', actions: ['Maintain \u20AC4.80/kg ceiling to preserve margin floor', 'Focus distribution on regional supers where PL pressure is lower', 'Rationalize to top 6 SKUs based on rate of sale', 'Bundle with Danone Essentials for cross-category promotion'], logoColor: '#FF7F50' },
    { id: 'danone', name: 'danone', displayName: 'Danone', segmentId: 'essentials-kids', pricePosition: 'Low-Tier', priceCorridor: '110-120 vs PL', priceLeadership: 'Follower', role: 'Stabilize', profitRole: 'Volume Driver', sharePct: 27.3, shareDeltaPp: -0.5, gpPct: 15.0, strategy: 'Maintain volume base in declining essentials segment. Protect margin through pack mix management.', actions: ['Defend \u20AC1.49 multi-pack price point in hyper channel', 'Shift mix toward 8-pack and 12-pack for higher absolute margin', 'Reduce promo depth from 30% to 20% discount ceiling', 'Exit underperforming flavor extensions (tropical, coconut)'], logoColor: '#0054A6' },
    { id: 'actimel', name: 'actimel', displayName: 'Actimel', segmentId: 'immunity', pricePosition: 'Premium', priceCorridor: '210-230 vs PL', priceLeadership: 'Leader', role: 'Accelerate', profitRole: 'Revenue & Profit Driver', sharePct: 61.3, shareDeltaPp: 1.8, gpPct: 42.5, strategy: 'Leverage immunity leadership and high GP to drive category growth. Expand usage occasions beyond breakfast.', actions: ['Launch Actimel Kids 4-pack to capture family immunity occasion', 'Introduce Actimel Shot format for on-the-go consumption', 'Maintain 210-230 index to protect premium positioning', 'Increase in-store health messaging with pharmacist endorsement'], logoColor: '#FFC300' },
    { id: 'danacol', name: 'danacol', displayName: 'Danacol', segmentId: 'cholesterol', pricePosition: 'Premium', priceCorridor: '160-170 vs PL', priceLeadership: 'Leader', role: 'Accelerate', profitRole: 'Profit Driver', sharePct: 88.7, shareDeltaPp: 1.0, gpPct: 50.0, strategy: 'Maximize profit extraction from near-monopoly position. Grow category by expanding target demographic beyond 55+.', actions: ['Launch Danacol Plus with added Vitamin D for 45-55 target', 'Optimize 6-pack and 12-pack price ladder for pantry loading', 'Protect 160-170 index \u2014 zero tolerance for price erosion', 'Invest in digital health partnerships for cholesterol awareness'], logoColor: '#D4001A' },
    { id: 'alpro', name: 'alpro', displayName: 'Alpro', segmentId: 'plant-based', pricePosition: 'Premium', priceCorridor: '140-160 vs PL', priceLeadership: 'Leader', role: 'Maximize', profitRole: 'Growth Driver', sharePct: 76.3, shareDeltaPp: 5.7, gpPct: 27.4, strategy: 'Maximize first-mover advantage in fastest-growing segment. Expand beyond soy into oat and almond bases.', actions: ['Launch Alpro Oat yogurt range across all channels', 'Secure secondary placement in health/wellness aisle', 'Maintain 140-160 index as PL enters plant-based', 'Increase penetration in Ahorramas and regional chains'], logoColor: '#7AB648' },
    { id: 'vitalinea', name: 'vitalinea', displayName: 'Vitalinea', segmentId: 'light', pricePosition: 'Mid-Tier', priceCorridor: '110-120 vs PL', priceLeadership: 'Follower', role: 'Stabilize', profitRole: 'Volume Driver', sharePct: 27.1, shareDeltaPp: -2.0, gpPct: 27.1, strategy: 'Manage controlled decline in shrinking Light segment. Migrate consumers toward Protein and Greek alternatives.', actions: ['Rationalize SKU count from 18 to 10 core references', 'Bridge consumers to YoPRO through co-branded trial packs', 'Maintain \u20AC1.79 4-pack price point in remaining distribution', 'Reduce trade investment by 25% and reallocate to growth brands'], logoColor: '#87CEEB' },
    { id: 'danonino', name: 'danonino', displayName: 'Danonino', segmentId: 'kids', pricePosition: 'Premium', priceCorridor: '170-190 vs PL', priceLeadership: 'Leader', role: 'Stabilize', profitRole: 'Revenue Driver', sharePct: 25.2, shareDeltaPp: -1.2, gpPct: 25.2, strategy: 'Defend Kids leadership through nutritional credentials and fun positioning. Counter birth-rate headwinds with consumption frequency.', actions: ['Launch Danonino Immunity variant with added Vitamin C/D', 'Introduce squeezable pouch format for on-the-go snacking', 'Strengthen back-to-school promotional calendar', 'Partner with children\u2019s entertainment brands for licensed packs'], logoColor: '#FF6B35' },
    { id: 'natillas', name: 'natillas', displayName: 'Natillas', segmentId: 'essentials-kids', pricePosition: 'Low-Tier', priceCorridor: '100-110 vs PL', priceLeadership: 'Follower', role: 'Stabilize', profitRole: 'Volume Driver', sharePct: 12.4, shareDeltaPp: -0.8, gpPct: 14.2, strategy: 'Maintain presence in custard/dessert sub-segment as volume base. Minimize investment and focus on core vanilla and chocolate.', actions: ['Limit range to vanilla, chocolate, and caramel only', 'Align promotional calendar with seasonal dessert peaks', 'Maintain parity pricing with PL to defend shelf presence', 'Explore co-branding with Danonino for kids dessert occasion'], logoColor: '#C4A35A' },
  ]
  for (const b of brands) {
    await prisma.brand.upsert({ where: { id: b.id }, update: b, create: b })
  }

  // ─── Retailers ─────────────────────────────────────────────
  console.log('  Retailers...')
  const retailers = [
    { id: 'carrefour-hyper', groupId: 'carrefour', name: 'carrefour-hyper', displayName: 'Carrefour Hyper', channelType: 'Hyper', logoColor: '#004E9A', marketSharePct: 15.2, yogurtSharePct: 16.8, relationshipScore: 7, negotiationStatus: 'Strong', keyConstraints: ['Annual JBP review in Q4 with category captain status', 'Shelf reset window limited to March and September', 'Minimum 12-week promotional lead time'], skuCount: 209, fairShareSkuCount: 241 },
    { id: 'carrefour-super', groupId: 'carrefour', name: 'carrefour-super', displayName: 'Carrefour Super', channelType: 'Super', logoColor: '#004E9A', marketSharePct: 10.1, yogurtSharePct: 11.3, relationshipScore: 7, negotiationStatus: 'Strong', keyConstraints: ['Smaller shelf sets require tighter SKU curation', 'Promotional mechanics aligned with Hyper but lower depth', 'Regional assortment variation across autonomous communities'], skuCount: 101, fairShareSkuCount: 93 },
    { id: 'ahorramas', groupId: 'ahorramas', name: 'ahorramas', displayName: 'Ahorramas', channelType: 'Regional Super', logoColor: '#E30613', marketSharePct: 8.4, yogurtSharePct: 9.1, relationshipScore: 6, negotiationStatus: 'Neutral', keyConstraints: ['Madrid-centric footprint limits national scale', 'Strong local brand loyalty requires tailored activations', 'Category review cycle every 6 months'], skuCount: 99, fairShareSkuCount: 90 },
    { id: 'mercadona', groupId: 'mercadona', name: 'mercadona', displayName: 'Mercadona', channelType: 'Discounter', logoColor: '#009639', marketSharePct: 25.3, yogurtSharePct: 27.1, relationshipScore: 4, negotiationStatus: 'Strained', keyConstraints: ['Hacendado private label dominance across all segments', 'Limited branded shelf space \u2014 interprovider model favors exclusivity', 'No promotional mechanics allowed for branded products', 'Listing decisions driven by Mercadona category manager unilaterally'], skuCount: 20, fairShareSkuCount: 30 },
    { id: 'discounters', groupId: 'discounters', name: 'discounters', displayName: 'Discounters (Lidl / DIA)', channelType: 'Discounter', logoColor: '#FFC107', marketSharePct: 12.0, yogurtSharePct: 10.5, relationshipScore: 5, negotiationStatus: 'Neutral', keyConstraints: ['Private label focus with limited branded slots', 'Lidl rotational listings create unpredictable demand', 'DIA undergoing format restructuring \u2014 uncertainty in store count', 'Combined negotiation leverage as channel aggregate'], skuCount: 45, fairShareSkuCount: 52 },
  ]
  for (const r of retailers) {
    await prisma.retailer.upsert({ where: { id: r.id }, update: r, create: r })
  }

  // ─── Competitors ───────────────────────────────────────────
  console.log('  Competitors...')
  const competitors = [
    { id: 'hacendado', name: 'Hacendado', isPrivateLabel: true, retailerId: 'mercadona', revenueIndex: 123, segments: ['bifidus', 'greek', 'protein', 'essentials-kids', 'kefir', 'immunity', 'light', 'kids'], pricePosition: 'Low-Tier' },
    { id: 'nestle', name: 'Nestl\u00E9', isPrivateLabel: false, retailerId: null, revenueIndex: 116, segments: ['greek', 'essentials-kids', 'kids', 'light'], pricePosition: 'Mid-Tier' },
    { id: 'pastoret', name: 'Pastoret', isPrivateLabel: false, retailerId: null, revenueIndex: 119, segments: ['greek', 'bifidus', 'kefir'], pricePosition: 'Premium' },
    { id: 'kaiku', name: 'Kaiku', isPrivateLabel: false, retailerId: null, revenueIndex: 113, segments: ['kefir', 'bifidus', 'essentials-kids'], pricePosition: 'Mid-Tier' },
    { id: 'dia', name: 'DIA', isPrivateLabel: true, retailerId: 'discounters', revenueIndex: 110, segments: ['essentials-kids', 'greek', 'bifidus', 'light'], pricePosition: 'Low-Tier' },
    { id: 'milbona', name: 'Milbona (Lidl)', isPrivateLabel: true, retailerId: 'discounters', revenueIndex: 109, segments: ['greek', 'essentials-kids', 'protein', 'bifidus'], pricePosition: 'Low-Tier' },
    { id: 'sojasun', name: 'Sojasun', isPrivateLabel: false, retailerId: null, revenueIndex: 108, segments: ['plant-based'], pricePosition: 'Mid-Tier' },
  ]
  for (const c of competitors) {
    await prisma.competitor.upsert({ where: { id: c.id }, update: c, create: c })
  }

  // ─── Annual Plan ───────────────────────────────────────────
  console.log('  Annual Plan...')
  await prisma.annualPlan.upsert({
    where: { id: 'current' },
    update: {
      year: 2026, category: 'Yogurt', market: 'Spain', status: 'at-risk',
      overallKPIs: { volumeIx: 101, netSalesIx: 104, netSalesDeltaM: 76.8, netSalesPerKgDelta: 2.7, salesMarginIx: 113, salesMarginDeltaM: 52.3, salesMarginDeltaPp: 3.3, tradeMarginIx: 106, tradeMarginDeltaM: 11.1, tradeMarginDeltaPp: 0.7 },
    },
    create: {
      id: 'current', year: 2026, category: 'Yogurt', market: 'Spain', status: 'at-risk',
      overallKPIs: { volumeIx: 101, netSalesIx: 104, netSalesDeltaM: 76.8, netSalesPerKgDelta: 2.7, salesMarginIx: 113, salesMarginDeltaM: 52.3, salesMarginDeltaPp: 3.3, tradeMarginIx: 106, tradeMarginDeltaM: 11.1, tradeMarginDeltaPp: 0.7 },
    },
  })

  // ─── Segment Targets ───────────────────────────────────────
  console.log('  Segment Targets...')
  const segmentTargets = [
    { segmentId: 'bifidus', volumeIx: 103, netSalesIx: 105, salesMarginIx: 110, salesMarginDeltaPp: 2.8, tradeMarginIx: 104, tradeMarginDeltaPp: 0.5, status: 'at-risk' },
    { segmentId: 'greek', volumeIx: 104, netSalesIx: 107, salesMarginIx: 114, salesMarginDeltaPp: 3.6, tradeMarginIx: 108, tradeMarginDeltaPp: 0.9, status: 'at-risk' },
    { segmentId: 'protein', volumeIx: 108, netSalesIx: 112, salesMarginIx: 118, salesMarginDeltaPp: 4.2, tradeMarginIx: 110, tradeMarginDeltaPp: 1.1, status: 'on-track' },
    { segmentId: 'essentials-kids', volumeIx: 100, netSalesIx: 102, salesMarginIx: 111, salesMarginDeltaPp: 2.9, tradeMarginIx: 105, tradeMarginDeltaPp: 0.6, status: 'on-track' },
    { segmentId: 'kefir', volumeIx: 106, netSalesIx: 108, salesMarginIx: 115, salesMarginDeltaPp: 3.5, tradeMarginIx: 107, tradeMarginDeltaPp: 0.8, status: 'on-track' },
    { segmentId: 'immunity', volumeIx: 102, netSalesIx: 105, salesMarginIx: 113, salesMarginDeltaPp: 3.3, tradeMarginIx: 106, tradeMarginDeltaPp: 0.7, status: 'on-track' },
    { segmentId: 'cholesterol', volumeIx: 99, netSalesIx: 101, salesMarginIx: 109, salesMarginDeltaPp: 2.4, tradeMarginIx: 104, tradeMarginDeltaPp: 0.5, status: 'on-track' },
    { segmentId: 'plant-based', volumeIx: 110, netSalesIx: 113, salesMarginIx: 119, salesMarginDeltaPp: 4.5, tradeMarginIx: 112, tradeMarginDeltaPp: 1.3, status: 'on-track' },
    { segmentId: 'light', volumeIx: 97, netSalesIx: 100, salesMarginIx: 108, salesMarginDeltaPp: 2.1, tradeMarginIx: 103, tradeMarginDeltaPp: 0.4, status: 'on-track' },
    { segmentId: 'kids', volumeIx: 102, netSalesIx: 104, salesMarginIx: 112, salesMarginDeltaPp: 3.1, tradeMarginIx: 106, tradeMarginDeltaPp: 0.7, status: 'on-track' },
  ]
  // Clear and recreate
  await prisma.segmentTarget.deleteMany()
  for (const st of segmentTargets) {
    await prisma.segmentTarget.create({ data: st })
  }

  // ─── Retailer Targets ──────────────────────────────────────
  console.log('  Retailer Targets...')
  const retailerTargets = [
    { retailerId: 'carrefour-hyper', volumeIx: 103, netSalesIx: 106, salesMarginIx: 117, salesMarginDeltaPp: 3.8, tradeMarginIx: 111, tradeMarginDeltaPp: 1.3, status: 'at-risk' },
    { retailerId: 'ahorramas', volumeIx: 102, netSalesIx: 104, salesMarginIx: 113, salesMarginDeltaPp: 3.4, tradeMarginIx: 106, tradeMarginDeltaPp: 0.6, status: 'on-track' },
    { retailerId: 'mercadona', volumeIx: 101, netSalesIx: 108, salesMarginIx: 116, salesMarginDeltaPp: 3.4, tradeMarginIx: 111, tradeMarginDeltaPp: 0.9, status: 'at-risk' },
    { retailerId: 'discounters', volumeIx: 103, netSalesIx: 102, salesMarginIx: 112, salesMarginDeltaPp: 4.7, tradeMarginIx: 98, tradeMarginDeltaPp: 0.0, status: 'on-track' },
  ]
  await prisma.retailerTarget.deleteMany()
  for (const rt of retailerTargets) {
    await prisma.retailerTarget.create({ data: rt })
  }

  // ─── Building Blocks ───────────────────────────────────────
  console.log('  Building Blocks...')
  const buildingBlocks = [
    { id: 'prior-year-gp', label: 'Prior Year GP', valuePp: 0.0, valueM: 360.0, type: 'subtotal', color: 'blue', description: 'Gross Profit baseline from 2025' },
    { id: 'npd', label: 'NPD & Innovation', valuePp: 0.8, valueM: 15.2, type: 'increase', color: 'teal', description: 'New product launches including Activia+ and YoPRO Crunch' },
    { id: 'ppa', label: 'Pack Price Architecture', valuePp: 1.2, valueM: 22.8, type: 'increase', color: 'teal', description: 'Format optimization and pack-size ladder improvements' },
    { id: 'pricing', label: 'Consumer Pricing', valuePp: 2.1, valueM: 39.9, type: 'increase', color: 'emerald', description: 'Strategic price increases across premium segments' },
    { id: 'sizing', label: 'Sizing', valuePp: -0.3, valueM: -5.7, type: 'decrease', color: 'orange', description: 'Unit size reduction on selected SKUs' },
    { id: 'promo', label: 'Promotional Mix', valuePp: 0.5, valueM: 9.5, type: 'increase', color: 'teal', description: 'Promo efficiency improvement and depth reduction' },
    { id: 's-effect', label: 'Market s-effect', valuePp: -1.0, valueM: -19.0, type: 'decrease', color: 'red', description: 'Channel mix shift toward discounters and private label growth' },
    { id: 'plan-gp', label: 'Plan GP', valuePp: 3.3, valueM: 422.7, type: 'subtotal', color: 'blue', description: 'Target Gross Profit for 2026' },
  ]
  for (const bb of buildingBlocks) {
    await prisma.buildingBlock.upsert({ where: { id: bb.id }, update: bb, create: bb })
  }

  // ─── Deviations ────────────────────────────────────────────
  console.log('  Deviations...')
  const deviations = [
    { id: 'dev-bifidus-carrefour-vol', segmentId: 'bifidus', retailerId: 'carrefour-hyper', metric: 'Volume Index', planned: 103, actual: 89, gapPct: -13.6, gapAbsolute: -14, severity: 'critical', rootCause: 'internal-execution', rootCauseDetail: 'Activia promotion underperformance; TPR events not generating expected uplift. Shelf visibility reduced after Carrefour planogram reset in January.', detectedDate: '2026-02-10', trending: 'worsening', recommendedAction: 'Activate emergency TPR with enhanced in-store visibility. Negotiate secondary placement for Activia 8-pack at killer price point of 3.49.' },
    { id: 'dev-bifidus-mercadona-vol', segmentId: 'bifidus', retailerId: 'mercadona', metric: 'Net Sales Index', planned: 105, actual: 88, gapPct: -16.2, gapAbsolute: -17, severity: 'warning', rootCause: 'external-competitor', rootCauseDetail: 'Hacendado yogurt range expansion eating into Activia shelf space. Mercadona added 6 new Hacendado bifidus SKUs in Q1 2026, reducing Activia facings by 30%.', detectedDate: '2026-02-18', trending: 'worsening', recommendedAction: 'Present Activia innovation pipeline to Mercadona buyer. Propose exclusive pack format (6x125g) to defend distribution. Accelerate Activia+ probiotic launch.' },
    { id: 'dev-greek-ahorramas-sm', segmentId: 'greek', retailerId: 'ahorramas', metric: 'Sales Margin Index', planned: 114, actual: 108, gapPct: -5.3, gapAbsolute: -6, severity: 'warning', rootCause: 'internal-promo', rootCauseDetail: 'Excessive deep-discount frequency on Oikos reducing incrementality. 3-for-2 mechanics running 4 weeks vs planned 2 weeks. Promo ROI dropped below 0.8.', detectedDate: '2026-02-25', trending: 'stable', recommendedAction: 'Reduce Oikos promotion depth from 33% to 25%. Shift to value-added promotions (bonus pack) instead of price cuts. Cap promotional weeks at 2 per period.' },
    { id: 'dev-kefir-mercadona-ns', segmentId: 'kefir', retailerId: 'mercadona', metric: 'Net Sales Index', planned: 108, actual: 95, gapPct: -12.0, gapAbsolute: -13, severity: 'warning', rootCause: 'external-competitor', rootCauseDetail: 'Hacendado kefir launch at 40% lower price point disrupting category. New 1L Hacendado kefir at 1.29 vs Danone 900ml at 2.15.', detectedDate: '2026-03-01', trending: 'worsening', recommendedAction: 'Introduce fighting SKU: 1L economy kefir at 1.69 price point. Reinforce premium positioning with gut health clinical claims. Propose category captaincy pitch to Mercadona.' },
    { id: 'dev-immunity-discounters-vol', segmentId: 'immunity', retailerId: 'discounters', metric: 'Volume Index', planned: 102, actual: 85, gapPct: -16.7, gapAbsolute: -17, severity: 'minor', rootCause: 'external-market', rootCauseDetail: 'Discounter range review removed smaller Actimel formats. Lidl and Aldi delisted Actimel 6-pack and 10-pack, retaining only 12-pack.', detectedDate: '2026-02-14', trending: 'stable', recommendedAction: 'Propose Actimel 14-pack exclusive format for discounters at competitive per-unit price. Negotiate re-listing of 6-pack with improved margin for retailer.' },
    { id: 'dev-essentials-price-gap', segmentId: 'essentials-kids', retailerId: null, metric: 'Price Index vs Private Label', planned: 145, actual: 162, gapPct: 11.7, gapAbsolute: 17, severity: 'minor', rootCause: 'external-market', rootCauseDetail: 'Private label deflation increasing perceived premium gap. Retailer own-label yogurts reduced prices by 5-8% while Danone held pricing, widening the gap from 45% to 62%.', detectedDate: '2026-03-05', trending: 'worsening', recommendedAction: 'Launch entry-price tier under Danone Essentials brand at 120 index vs PL. Activate multi-buy mechanics (4 for 3) to reduce effective per-unit cost.' },
    { id: 'dev-plantbased-carrefour-pos', segmentId: 'plant-based', retailerId: 'carrefour-hyper', metric: 'Volume Index', planned: 110, actual: 118, gapPct: 7.3, gapAbsolute: 8, severity: 'none', rootCause: 'external-market', rootCauseDetail: 'Alpro new listings performing above plan. Carrefour expanded plant-based yogurt shelf by 40%, Alpro coconut and oat ranges exceeding rate of sale targets by 25%.', detectedDate: '2026-02-20', trending: 'improving', recommendedAction: 'Accelerate Alpro NPD pipeline. Propose permanent shelf expansion. Double down on Alpro Greek Style launch in Q2.' },
    { id: 'dev-protein-all-pos', segmentId: 'protein', retailerId: null, metric: 'Net Sales Index', planned: 112, actual: 118, gapPct: 5.4, gapAbsolute: 6, severity: 'none', rootCause: 'external-market', rootCauseDetail: 'YoPRO benefiting from health and fitness trend. High-protein yogurt category growing at +18% driven by gym culture and social media health influencers.', detectedDate: '2026-03-08', trending: 'improving', recommendedAction: 'Fast-track YoPRO 25g protein SKU launch. Increase media spend on protein segment by 20%. Secure incremental shelf space at Carrefour and Mercadona.' },
  ]
  for (const d of deviations) {
    await prisma.deviation.upsert({ where: { id: d.id }, update: d, create: d })
  }

  // ─── Retailer Pricing ──────────────────────────────────────
  console.log('  Retailer Pricing...')
  const pricingData = [
    { brandId: 'activia', retailerId: 'carrefour-hyper', currentIndex: 198, recommendedIndex: 200, competitiveness: 'Competitive', rationale: 'Within corridor; slight room to close gap to 200 ceiling' },
    { brandId: 'activia', retailerId: 'ahorramas', currentIndex: 207, recommendedIndex: 203, competitiveness: 'Uncompetitive', rationale: 'Above corridor ceiling; losing volume to Hacendado shelf neighbor' },
    { brandId: 'activia', retailerId: 'mercadona', currentIndex: 265, recommendedIndex: 265, competitiveness: 'Competitive', rationale: 'Mercadona fixed-price constraint; no flexibility but margin holds' },
    { brandId: 'oikos', retailerId: 'carrefour-hyper', currentIndex: 268, recommendedIndex: 265, competitiveness: 'Uncompetitive', rationale: 'Slightly above corridor; Pastoret closing gap at 255' },
    { brandId: 'oikos', retailerId: 'ahorramas', currentIndex: 275, recommendedIndex: 270, competitiveness: 'Uncompetitive', rationale: 'Premium stretch too wide vs regional PL alternatives' },
    { brandId: 'oikos', retailerId: 'mercadona', currentIndex: 204, recommendedIndex: 202, competitiveness: 'Competitive', rationale: 'Griego format; tight corridor but within range' },
    { brandId: 'danone', retailerId: 'carrefour-hyper', currentIndex: 118, recommendedIndex: 115, competitiveness: 'Uncompetitive', rationale: 'PL at 100; gap too narrow to justify brand premium' },
    { brandId: 'danone', retailerId: 'ahorramas', currentIndex: 112, recommendedIndex: 115, competitiveness: 'Over-competitive', rationale: 'Below corridor floor; eroding brand value perception' },
    { brandId: 'danone', retailerId: 'mercadona', currentIndex: 120, recommendedIndex: 120, competitiveness: 'Competitive', rationale: 'Fixed shelf price; aligned with corridor ceiling' },
    { brandId: 'yopro', retailerId: 'carrefour-hyper', currentIndex: 135, recommendedIndex: 138, competitiveness: 'Over-competitive', rationale: 'Below corridor; functional premium under-captured' },
    { brandId: 'yopro', retailerId: 'ahorramas', currentIndex: 142, recommendedIndex: 140, competitiveness: 'Competitive', rationale: 'Within corridor; protein shoppers less price-sensitive' },
    { brandId: 'yopro', retailerId: 'mercadona', currentIndex: 130, recommendedIndex: 135, competitiveness: 'Over-competitive', rationale: 'Mercadona price point below potential; margin opportunity' },
    { brandId: 'actimel', retailerId: 'carrefour-hyper', currentIndex: 220, recommendedIndex: 225, competitiveness: 'Over-competitive', rationale: 'Room to push toward ceiling; brand ritual supports premium' },
    { brandId: 'actimel', retailerId: 'ahorramas', currentIndex: 228, recommendedIndex: 225, competitiveness: 'Competitive', rationale: 'At corridor ceiling; holding price leadership' },
    { brandId: 'actimel', retailerId: 'mercadona', currentIndex: 215, recommendedIndex: 220, competitiveness: 'Over-competitive', rationale: 'Slightly below optimal; constrained by Mercadona margin rules' },
    { brandId: 'danacol', retailerId: 'carrefour-hyper', currentIndex: 168, recommendedIndex: 170, competitiveness: 'Competitive', rationale: 'Near ceiling; near-monopoly allows price leadership' },
    { brandId: 'danacol', retailerId: 'ahorramas', currentIndex: 165, recommendedIndex: 168, competitiveness: 'Over-competitive', rationale: 'Below corridor; regional margin opportunity exists' },
    { brandId: 'danacol', retailerId: 'mercadona', currentIndex: 162, recommendedIndex: 165, competitiveness: 'Over-competitive', rationale: 'Slightly below corridor; clinical brand equity under-monetized' },
    { brandId: 'alpro', retailerId: 'carrefour-hyper', currentIndex: 155, recommendedIndex: 155, competitiveness: 'Competitive', rationale: 'Mid-corridor; sustainability premium well-positioned' },
    { brandId: 'alpro', retailerId: 'ahorramas', currentIndex: 162, recommendedIndex: 158, competitiveness: 'Uncompetitive', rationale: 'Above corridor; plant-based shoppers switching to PL' },
    { brandId: 'alpro', retailerId: 'mercadona', currentIndex: 148, recommendedIndex: 150, competitiveness: 'Over-competitive', rationale: 'Below corridor; Hacendado vegetal at 100 compresses range' },
    { brandId: 'vitalinea', retailerId: 'carrefour-hyper', currentIndex: 108, recommendedIndex: 112, competitiveness: 'Over-competitive', rationale: 'Below corridor floor; declining segment needs margin focus' },
    { brandId: 'vitalinea', retailerId: 'ahorramas', currentIndex: 115, recommendedIndex: 112, competitiveness: 'Uncompetitive', rationale: 'Above corridor; PL light alternatives at 95' },
    { brandId: 'vitalinea', retailerId: 'mercadona', currentIndex: 110, recommendedIndex: 112, competitiveness: 'Competitive', rationale: 'Close to corridor center; stable but declining category' },
    { brandId: 'danonino', retailerId: 'carrefour-hyper', currentIndex: 158, recommendedIndex: 155, competitiveness: 'Uncompetitive', rationale: 'Above corridor; parents switching to PL petit suisse' },
    { brandId: 'danonino', retailerId: 'ahorramas', currentIndex: 152, recommendedIndex: 155, competitiveness: 'Over-competitive', rationale: 'Below corridor; promo-driven pricing leaking margin' },
    { brandId: 'danonino', retailerId: 'mercadona', currentIndex: 145, recommendedIndex: 148, competitiveness: 'Over-competitive', rationale: 'Below corridor; Hacendado petit suisse at 85 compresses range' },
  ]
  await prisma.retailerPricing.deleteMany()
  for (const p of pricingData) {
    await prisma.retailerPricing.create({ data: p })
  }

  // ─── Cross Elasticity ──────────────────────────────────────
  console.log('  Cross Elasticity...')
  const crossElasticity = [
    // Carrefour
    { brandId: 'actimel', retailerId: 'carrefour-hyper', retentionScore: -2.1, appealScore: -0.3, selfElasticity: -2.1, quadrant: 'low-ret-low-appeal', keyCrossEffect: 'Low retention, low appeal' },
    { brandId: 'nesquik', retailerId: 'carrefour-hyper', retentionScore: -2.15, appealScore: -0.5, selfElasticity: -2.15, quadrant: 'low-ret-low-appeal', keyCrossEffect: 'Low retention, low appeal' },
    { brandId: 'oikos', retailerId: 'carrefour-hyper', retentionScore: -1.85, appealScore: -1.4, selfElasticity: -1.85, quadrant: 'low-ret-high-appeal', keyCrossEffect: 'Low retention, high appeal' },
    { brandId: 'activia', retailerId: 'carrefour-hyper', retentionScore: -1.3, appealScore: -0.3, selfElasticity: -1.3, quadrant: 'low-ret-low-appeal', keyCrossEffect: 'Low retention, low appeal' },
    { brandId: 'danone', retailerId: 'carrefour-hyper', retentionScore: -1.5, appealScore: -1.2, selfElasticity: -1.5, quadrant: 'low-ret-high-appeal', keyCrossEffect: 'Low retention, high appeal' },
    { brandId: 'nestle', retailerId: 'carrefour-hyper', retentionScore: -1.0, appealScore: -0.5, selfElasticity: -1.0, quadrant: 'high-ret-low-appeal', keyCrossEffect: 'High retention, low appeal' },
    { brandId: 'alpro', retailerId: 'carrefour-hyper', retentionScore: -1.0, appealScore: -1.3, selfElasticity: -1.0, quadrant: 'high-ret-high-appeal', keyCrossEffect: 'High retention, high appeal' },
    { brandId: 'danonino', retailerId: 'carrefour-hyper', retentionScore: -1.0, appealScore: -0.8, selfElasticity: -1.0, quadrant: 'high-ret-low-appeal', keyCrossEffect: 'High retention, low appeal' },
    { brandId: 'vitalinea', retailerId: 'carrefour-hyper', retentionScore: -0.8, appealScore: -1.4, selfElasticity: -0.8, quadrant: 'high-ret-high-appeal', keyCrossEffect: 'High retention, high appeal' },
    { brandId: 'carrefour-pl', retailerId: 'carrefour-hyper', retentionScore: -0.7, appealScore: -0.4, selfElasticity: -0.7, quadrant: 'high-ret-low-appeal', keyCrossEffect: 'High retention, low appeal' },
    { brandId: 'kaiku', retailerId: 'carrefour-hyper', retentionScore: -0.6, appealScore: -0.5, selfElasticity: -0.6, quadrant: 'high-ret-low-appeal', keyCrossEffect: 'High retention, low appeal' },
    { brandId: 'yopro', retailerId: 'carrefour-hyper', retentionScore: -1.0, appealScore: -1.5, selfElasticity: -1.0, quadrant: 'high-ret-high-appeal', keyCrossEffect: 'High retention, high appeal' },
    { brandId: 'pastoret', retailerId: 'carrefour-hyper', retentionScore: -1.8, appealScore: -2.2, selfElasticity: -1.8, quadrant: 'low-ret-high-appeal', keyCrossEffect: 'Low retention, high appeal' },
    // Mercadona
    { brandId: 'actimel', retailerId: 'mercadona', retentionScore: -1.9, appealScore: -0.5, selfElasticity: -1.9, quadrant: 'low-ret-low-appeal', keyCrossEffect: 'Low retention, low appeal' },
    { brandId: 'danone', retailerId: 'mercadona', retentionScore: -1.7, appealScore: -0.6, selfElasticity: -1.7, quadrant: 'low-ret-low-appeal', keyCrossEffect: 'Low retention, low appeal' },
    { brandId: 'activia', retailerId: 'mercadona', retentionScore: -1.4, appealScore: -0.35, selfElasticity: -1.4, quadrant: 'low-ret-low-appeal', keyCrossEffect: 'Low retention, low appeal' },
    { brandId: 'la-lechera', retailerId: 'mercadona', retentionScore: -1.55, appealScore: -0.4, selfElasticity: -1.55, quadrant: 'low-ret-low-appeal', keyCrossEffect: 'Low retention, low appeal' },
    { brandId: 'alpro', retailerId: 'mercadona', retentionScore: -1.35, appealScore: -1.6, selfElasticity: -1.35, quadrant: 'low-ret-high-appeal', keyCrossEffect: 'Low retention, high appeal' },
    { brandId: 'nesquik', retailerId: 'mercadona', retentionScore: -1.0, appealScore: -0.6, selfElasticity: -1.0, quadrant: 'high-ret-low-appeal', keyCrossEffect: 'High retention, low appeal' },
    { brandId: 'hacendado', retailerId: 'mercadona', retentionScore: -0.2, appealScore: -0.25, selfElasticity: -0.2, quadrant: 'high-ret-low-appeal', keyCrossEffect: 'High retention, low appeal' },
    { brandId: 'danonino', retailerId: 'mercadona', retentionScore: -0.35, appealScore: -0.4, selfElasticity: -0.35, quadrant: 'high-ret-low-appeal', keyCrossEffect: 'High retention, low appeal' },
  ]
  await prisma.crossElasticityEntry.deleteMany()
  for (const ce of crossElasticity) {
    await prisma.crossElasticityEntry.create({ data: ce })
  }

  // ─── Promo Efficiency ──────────────────────────────────────
  console.log('  Promo Efficiency...')
  const promoEfficiency = [
    // Ahorramas
    { brandId: 'activia', retailerId: 'ahorramas', promoValueSalesK: 2600, vsodPct: 37, vsodEvolutionPct: 54, valueUpliftPct: -75, isEfficient: false },
    { brandId: 'danone', retailerId: 'ahorramas', promoValueSalesK: 1700, vsodPct: 36, vsodEvolutionPct: -46, valueUpliftPct: -20, isEfficient: false },
    { brandId: 'actimel', retailerId: 'ahorramas', promoValueSalesK: 1175, vsodPct: 34, vsodEvolutionPct: 62, valueUpliftPct: -39, isEfficient: false },
    { brandId: 'danacol', retailerId: 'ahorramas', promoValueSalesK: 760, vsodPct: 31, vsodEvolutionPct: 139, valueUpliftPct: 110, isEfficient: true },
    { brandId: 'alpro', retailerId: 'ahorramas', promoValueSalesK: 580, vsodPct: 49, vsodEvolutionPct: 53, valueUpliftPct: -33, isEfficient: false },
    { brandId: 'proteina', retailerId: 'ahorramas', promoValueSalesK: 530, vsodPct: 52, vsodEvolutionPct: -19, valueUpliftPct: 3, isEfficient: false },
    { brandId: 'yopro', retailerId: 'ahorramas', promoValueSalesK: 360, vsodPct: 46, vsodEvolutionPct: 171, valueUpliftPct: 5, isEfficient: false },
    { brandId: 'oikos', retailerId: 'ahorramas', promoValueSalesK: 90, vsodPct: 6, vsodEvolutionPct: -25, valueUpliftPct: 35, isEfficient: true },
    { brandId: 'danonino', retailerId: 'ahorramas', promoValueSalesK: 30, vsodPct: 3, vsodEvolutionPct: -25, valueUpliftPct: -135, isEfficient: false },
    // Carrefour
    { brandId: 'activia', retailerId: 'carrefour-hyper', promoValueSalesK: 4200, vsodPct: 42, vsodEvolutionPct: 38, valueUpliftPct: -55, isEfficient: false },
    { brandId: 'danone', retailerId: 'carrefour-hyper', promoValueSalesK: 2800, vsodPct: 40, vsodEvolutionPct: -32, valueUpliftPct: -15, isEfficient: false },
    { brandId: 'actimel', retailerId: 'carrefour-hyper', promoValueSalesK: 1950, vsodPct: 38, vsodEvolutionPct: 45, valueUpliftPct: -28, isEfficient: false },
    { brandId: 'danacol', retailerId: 'carrefour-hyper', promoValueSalesK: 1100, vsodPct: 28, vsodEvolutionPct: 95, valueUpliftPct: 85, isEfficient: true },
    { brandId: 'alpro', retailerId: 'carrefour-hyper', promoValueSalesK: 920, vsodPct: 44, vsodEvolutionPct: 40, valueUpliftPct: -25, isEfficient: false },
    { brandId: 'yopro', retailerId: 'carrefour-hyper', promoValueSalesK: 680, vsodPct: 41, vsodEvolutionPct: 120, valueUpliftPct: 12, isEfficient: true },
    { brandId: 'oikos', retailerId: 'carrefour-hyper', promoValueSalesK: 250, vsodPct: 10, vsodEvolutionPct: -15, valueUpliftPct: 42, isEfficient: true },
    { brandId: 'danonino', retailerId: 'carrefour-hyper', promoValueSalesK: 180, vsodPct: 8, vsodEvolutionPct: -18, valueUpliftPct: -95, isEfficient: false },
    // Mercadona
    { brandId: 'activia', retailerId: 'mercadona', promoValueSalesK: 850, vsodPct: 25, vsodEvolutionPct: 20, valueUpliftPct: -40, isEfficient: false },
    { brandId: 'danacol', retailerId: 'mercadona', promoValueSalesK: 420, vsodPct: 22, vsodEvolutionPct: 85, valueUpliftPct: 70, isEfficient: true },
    { brandId: 'actimel', retailerId: 'mercadona', promoValueSalesK: 380, vsodPct: 20, vsodEvolutionPct: 30, valueUpliftPct: -18, isEfficient: false },
  ]
  await prisma.promoEfficiency.deleteMany()
  for (const pe of promoEfficiency) {
    await prisma.promoEfficiency.create({ data: pe })
  }

  // ─── Promo Calendar ────────────────────────────────────────
  console.log('  Promo Calendar...')
  const promoCalendar = [
    { id: 'pc-01', brandId: 'activia', segmentId: 'bifidus', retailerId: 'carrefour-hyper', mechanic: 'tpr-25-35', mechanicLabel: 'TPR 30%', startWeek: 3, endWeek: 5, discountPct: 30, expectedUpliftPct: 15, estimatedValueK: 180, isOptimized: false, conflictFlag: 'Deep discount on Activia conflicts with pricing corridor strategy' },
    { id: 'pc-01o', brandId: 'activia', segmentId: 'bifidus', retailerId: 'carrefour-hyper', mechanic: '2nd-50pct', mechanicLabel: '2nd @ 50%', startWeek: 3, endWeek: 5, discountPct: 25, expectedUpliftPct: 60, estimatedValueK: 240, isOptimized: true },
    { id: 'pc-02', brandId: 'activia', segmentId: 'bifidus', retailerId: 'ahorramas', mechanic: 'tpr-40plus', mechanicLabel: 'TPR 40%', startWeek: 6, endWeek: 8, discountPct: 40, expectedUpliftPct: 10, estimatedValueK: 95, isOptimized: false, conflictFlag: 'Excessive depth destroying profitability' },
    { id: 'pc-02o', brandId: 'activia', segmentId: 'bifidus', retailerId: 'ahorramas', mechanic: 'multi-buy', mechanicLabel: 'Buy 3 pay 2', startWeek: 6, endWeek: 8, discountPct: 33, expectedUpliftPct: 80, estimatedValueK: 190, isOptimized: true },
    { id: 'pc-03', brandId: 'oikos', segmentId: 'greek', retailerId: 'carrefour-hyper', mechanic: 'tpr-25-35', mechanicLabel: 'TPR 25%', startWeek: 4, endWeek: 6, discountPct: 25, expectedUpliftPct: 20, estimatedValueK: 120, isOptimized: false },
    { id: 'pc-03o', brandId: 'oikos', segmentId: 'greek', retailerId: 'carrefour-hyper', mechanic: '2nd-50pct', mechanicLabel: '2nd @ 50%', startWeek: 4, endWeek: 6, discountPct: 25, expectedUpliftPct: 55, estimatedValueK: 165, isOptimized: true },
    { id: 'pc-04', brandId: 'actimel', segmentId: 'immunity', retailerId: 'carrefour-hyper', mechanic: 'bogof', mechanicLabel: 'Buy 1 Get 1', startWeek: 2, endWeek: 4, discountPct: 50, expectedUpliftPct: 120, estimatedValueK: 310, isOptimized: false },
    { id: 'pc-05', brandId: 'actimel', segmentId: 'immunity', retailerId: 'ahorramas', mechanic: 'tpr-10-20', mechanicLabel: 'TPR 15%', startWeek: 8, endWeek: 10, discountPct: 15, expectedUpliftPct: 25, estimatedValueK: 85, isOptimized: false },
    { id: 'pc-06', brandId: 'danone', segmentId: 'essentials-kids', retailerId: 'carrefour-hyper', mechanic: 'multi-buy', mechanicLabel: '3 for 5', startWeek: 14, endWeek: 17, discountPct: 17, expectedUpliftPct: 70, estimatedValueK: 220, isOptimized: true },
    { id: 'pc-07', brandId: 'yopro', segmentId: 'protein', retailerId: 'carrefour-hyper', mechanic: 'tpr-10-20', mechanicLabel: 'TPR 15%', startWeek: 16, endWeek: 18, discountPct: 15, expectedUpliftPct: 30, estimatedValueK: 75, isOptimized: false },
    { id: 'pc-08', brandId: 'alpro', segmentId: 'plant-based', retailerId: 'carrefour-hyper', mechanic: '2nd-50pct', mechanicLabel: '2nd @ 50%', startWeek: 18, endWeek: 20, discountPct: 25, expectedUpliftPct: 65, estimatedValueK: 140, isOptimized: true },
    { id: 'pc-09', brandId: 'actimel', segmentId: 'immunity', retailerId: 'mercadona', mechanic: 'tpr-10-20', mechanicLabel: 'TPR 10%', startWeek: 15, endWeek: 17, discountPct: 10, expectedUpliftPct: 15, estimatedValueK: 55, isOptimized: false },
    { id: 'pc-10', brandId: 'danacol', segmentId: 'cholesterol', retailerId: 'mercadona', mechanic: 'loyalty', mechanicLabel: 'Loyalty Points', startWeek: 20, endWeek: 22, discountPct: 8, expectedUpliftPct: 20, estimatedValueK: 45, isOptimized: true },
    { id: 'pc-11', brandId: 'activia', segmentId: 'bifidus', retailerId: 'carrefour-hyper', mechanic: '2nd-50pct', mechanicLabel: '2nd @ 50%', startWeek: 26, endWeek: 28, discountPct: 25, expectedUpliftPct: 55, estimatedValueK: 195, isOptimized: true },
    { id: 'pc-12', brandId: 'danonino', segmentId: 'kids', retailerId: 'carrefour-hyper', mechanic: 'multi-buy', mechanicLabel: '2 for 4', startWeek: 30, endWeek: 33, discountPct: 20, expectedUpliftPct: 75, estimatedValueK: 130, isOptimized: true },
    { id: 'pc-13', brandId: 'danone', segmentId: 'essentials-kids', retailerId: 'ahorramas', mechanic: 'tpr-25-35', mechanicLabel: 'TPR 30%', startWeek: 28, endWeek: 30, discountPct: 30, expectedUpliftPct: 20, estimatedValueK: 110, isOptimized: false },
    { id: 'pc-14', brandId: 'oikos', segmentId: 'greek', retailerId: 'carrefour-hyper', mechanic: 'sampling', mechanicLabel: 'In-store sampling', startWeek: 45, endWeek: 47, discountPct: 0, expectedUpliftPct: 40, estimatedValueK: 90, isOptimized: true },
    { id: 'pc-15', brandId: 'activia', segmentId: 'bifidus', retailerId: 'ahorramas', mechanic: '2nd-50pct', mechanicLabel: '2nd @ 50%', startWeek: 46, endWeek: 48, discountPct: 25, expectedUpliftPct: 55, estimatedValueK: 175, isOptimized: true },
    { id: 'pc-16', brandId: 'alpro', segmentId: 'plant-based', retailerId: 'ahorramas', mechanic: 'tpr-10-20', mechanicLabel: 'TPR 15%', startWeek: 48, endWeek: 50, discountPct: 15, expectedUpliftPct: 30, estimatedValueK: 65, isOptimized: false },
  ]
  for (const pc of promoCalendar) {
    await prisma.promoCalendarEvent.upsert({ where: { id: pc.id }, update: pc, create: pc })
  }

  // ─── Promo Recommendations ─────────────────────────────────
  console.log('  Promo Recommendations...')
  const promoRecs = [
    { retailerId: 'carrefour-hyper', area: 'Price Points', recommendation: '\u20AC2 is a common killer price point across segments. Anchor all 4-pack promotions around this threshold to maximize conversion.', impact: 'Maintains price perception while protecting margin corridor' },
    { retailerId: 'carrefour-hyper', area: 'Depth Of Deal', recommendation: 'Increasing depth doesn\u2019t improve incrementality except for Danacol. Cap standard discounts at 25% and reserve deep cuts for Danacol pantry-loading events only.', impact: 'Reduces margin erosion by ~3pp across Activia and Actimel' },
    { retailerId: 'carrefour-hyper', area: 'Mechanics', recommendation: 'Multi-buys (BOGOF, 2nd@50%) deliver significantly more uplift than straight discounts. Shift 40% of TPR budget to multi-buy mechanics.', impact: 'Expected +15-25% incremental uplift per promo event' },
    { retailerId: 'carrefour-hyper', area: 'Frequency', recommendation: 'Reduce promo frequency to improve profitability. Prioritize fewer, larger multi-buy events over continuous TPR windows.', impact: 'Improves promo ROI by reducing stock-up / pantry-loading cannibalization' },
    { retailerId: 'carrefour-hyper', area: 'Seasonality', recommendation: 'No meaningful seasonality for yogurt in Spain. Distribute promo events evenly across the year rather than concentrating in Q1/Q4.', impact: 'Smoother demand curve, reduced supply chain volatility' },
    { retailerId: 'carrefour-hyper', area: 'Visibility', recommendation: 'Feature + Display = 2-2.5x amplification of promo event. Always pair promotional pricing with secondary display and leaflet feature.', impact: 'Doubles incremental volume per euro of trade spend' },
    { retailerId: 'ahorramas', area: 'Price Points', recommendation: '\u20AC1.50 and \u20AC2 are the dominant killer price points. Use \u20AC1.50 for Essentials/Griego and \u20AC2 for premium brands.', impact: 'Aligns with shopper price sensitivity in regional super format' },
    { retailerId: 'ahorramas', area: 'Depth Of Deal', recommendation: 'Reduce average promo depth from 35% to 20%. Deep discounts on Activia at Ahorramas show negative value uplift (-75%).', impact: 'Recovers estimated \u20AC400K margin annually on Activia alone' },
    { retailerId: 'ahorramas', area: 'Mechanics', recommendation: 'Introduce 2nd@50% mechanic for Actimel and Danacol. Replace straight TPR events which show diminishing returns.', impact: 'Expected +30-40% volume uplift improvement vs current TPR' },
    { retailerId: 'ahorramas', area: 'Frequency', recommendation: 'Activia is over-promoted at 37% VSOD. Reduce Activia promo weeks from 19 to 12 per year and reinvest in Danacol.', impact: 'Shifts spend from inefficient (Activia) to efficient (Danacol) brands' },
    { retailerId: 'ahorramas', area: 'Seasonality', recommendation: 'Align Danonino promotions with back-to-school (Sep) and Easter periods for maximum family purchase relevance.', impact: 'Concentrates kids spend in peak consumption windows' },
    { retailerId: 'ahorramas', area: 'Visibility', recommendation: 'Negotiate end-cap displays for multi-buy events. Ahorramas stores with secondary displays show 1.8x promo lift.', impact: 'Improves in-store visibility without additional discount depth' },
    { retailerId: 'mercadona', area: 'Price Points', recommendation: 'Mercadona EDLP model limits promotional pricing. Focus on everyday shelf price competitiveness at \u20AC2 and \u20AC3 thresholds.', impact: 'Maintains listings in EDLP environment' },
    { retailerId: 'mercadona', area: 'Depth Of Deal', recommendation: 'Minimal promo depth possible in Mercadona format. Focus on pack-size/price architecture rather than temporary discounts.', impact: 'Better long-term price positioning vs Hacendado PL' },
    { retailerId: 'mercadona', area: 'Mechanics', recommendation: 'Limited mechanic options in Mercadona. Leverage new product introductions and innovation launches as primary activation tool.', impact: 'Innovation-led growth compensates for limited promotional flexibility' },
    { retailerId: 'mercadona', area: 'Frequency', recommendation: 'N/A in EDLP format. Focus investment on listing fees and innovation slots rather than promotional calendars.', impact: 'Protects distribution breadth in largest Spanish retailer' },
    { retailerId: 'mercadona', area: 'Seasonality', recommendation: 'Use seasonal innovation launches (summer limited editions, winter immunity) to create news in the absence of price promotions.', impact: 'Drives incremental trial through novelty rather than price' },
    { retailerId: 'mercadona', area: 'Visibility', recommendation: 'In Mercadona, shelf position is the primary visibility lever. Invest in category captaincy conversations to secure optimal placement.', impact: 'Better shelf positioning can deliver 10-15% sales uplift' },
  ]
  await prisma.promoRecommendation.deleteMany()
  for (const pr of promoRecs) {
    await prisma.promoRecommendation.create({ data: pr })
  }

  // ─── Pack Price Entries ─────────────────────────────────────
  console.log('  Pack Price Architecture...')
  const packPrices = [
    // Current
    { brandId: 'oikos', segmentId: 'greek', packSize: '4x110g Oikos', unitPrice: 6.34, pricePerKg: 2.79, gpPct: 27.7, isIdeal: false },
    { brandId: 'yopro', segmentId: 'protein', packSize: '4x120g YoPRO', unitPrice: 6.23, pricePerKg: 2.99, gpPct: 28.4, isIdeal: false },
    { brandId: 'activia', segmentId: 'bifidus', packSize: '4x120g Bifidus Flavored', unitPrice: 6.23, pricePerKg: 2.99, gpPct: 38.1, isIdeal: false },
    { brandId: 'activia', segmentId: 'bifidus', packSize: '4x115g Bifidus Fibras', unitPrice: 6.20, pricePerKg: 2.85, gpPct: 38.1, isIdeal: false },
    { brandId: 'activia', segmentId: 'bifidus', packSize: '4x120g Bifidus Naturals', unitPrice: 5.52, pricePerKg: 2.65, gpPct: 38.1, isIdeal: false },
    { brandId: 'activia', segmentId: 'bifidus', packSize: '4x115g Bifidus Cremosos', unitPrice: 5.33, pricePerKg: 2.45, gpPct: 38.1, isIdeal: false },
    { brandId: 'proteina', segmentId: 'protein', packSize: '4x105g Protein', unitPrice: 4.50, pricePerKg: 1.89, gpPct: 18.5, isIdeal: false },
    { brandId: 'vitalinea', segmentId: 'light', packSize: '4x120g Vitalinea', unitPrice: 4.35, pricePerKg: 2.09, gpPct: 27.1, isIdeal: false },
    { brandId: 'natillas', segmentId: 'essentials-kids', packSize: '4x120g Danone Natillas', unitPrice: 4.15, pricePerKg: 1.99, gpPct: 14.2, isIdeal: false },
    { brandId: 'griego', segmentId: 'greek', packSize: '4x110g Griego Flavoured', unitPrice: 3.61, pricePerKg: 1.59, gpPct: 22.3, isIdeal: false },
    { brandId: 'griego', segmentId: 'greek', packSize: '4x110g Griego Naturals', unitPrice: 3.16, pricePerKg: 1.39, gpPct: 22.3, isIdeal: false },
    { brandId: 'danone', segmentId: 'essentials-kids', packSize: '4x110g Danone Essentials', unitPrice: 2.08, pricePerKg: 1.00, gpPct: 15.0, isIdeal: false },
    // Ideal
    { brandId: 'oikos', segmentId: 'greek', packSize: '4x80g Oikos (ideal)', unitPrice: 6.34, pricePerKg: 3.96, gpPct: 35.0, isIdeal: true },
    { brandId: 'yopro', segmentId: 'protein', packSize: '4x80g YoPRO (ideal)', unitPrice: 6.23, pricePerKg: 3.89, gpPct: 36.0, isIdeal: true },
    { brandId: 'activia', segmentId: 'bifidus', packSize: '4x80g Bifidus Flavored (ideal)', unitPrice: 6.23, pricePerKg: 3.89, gpPct: 45.0, isIdeal: true },
    { brandId: 'activia', segmentId: 'bifidus', packSize: '4x80g Bifidus Fibras (ideal)', unitPrice: 6.20, pricePerKg: 3.88, gpPct: 45.0, isIdeal: true },
    { brandId: 'activia', segmentId: 'bifidus', packSize: '4x120g Bifidus Naturals (ideal)', unitPrice: 5.52, pricePerKg: 2.65, gpPct: 38.1, isIdeal: true },
    { brandId: 'activia', segmentId: 'bifidus', packSize: '4x120g Bifidus Cremosos (ideal)', unitPrice: 5.33, pricePerKg: 2.45, gpPct: 38.1, isIdeal: true },
    { brandId: 'proteina', segmentId: 'protein', packSize: '4x120g Protein (ideal)', unitPrice: 4.50, pricePerKg: 1.89, gpPct: 18.5, isIdeal: true },
    { brandId: 'vitalinea', segmentId: 'light', packSize: '4x120g Vitalinea (ideal)', unitPrice: 4.35, pricePerKg: 2.09, gpPct: 27.1, isIdeal: true },
    { brandId: 'natillas', segmentId: 'essentials-kids', packSize: '4x120g Natillas (ideal)', unitPrice: 4.15, pricePerKg: 1.99, gpPct: 14.2, isIdeal: true },
    { brandId: 'griego', segmentId: 'greek', packSize: '4x120g Griego Flavoured (ideal)', unitPrice: 3.61, pricePerKg: 1.50, gpPct: 22.3, isIdeal: true },
    { brandId: 'griego', segmentId: 'greek', packSize: '4x120g Griego Naturals (ideal)', unitPrice: 3.16, pricePerKg: 1.32, gpPct: 22.3, isIdeal: true },
    { brandId: 'danone', segmentId: 'essentials-kids', packSize: '1x240g Danone Essentials (ideal)', unitPrice: 2.08, pricePerKg: 2.00, gpPct: 22.0, isIdeal: true },
  ]
  await prisma.packPriceEntry.deleteMany()
  for (const pp of packPrices) {
    await prisma.packPriceEntry.create({ data: pp })
  }

  // ─── SKU Share vs Value ─────────────────────────────────────
  console.log('  SKU Share vs Value...')
  function assessSKU(ratio: number): string {
    if (ratio > 120) return 'Over-SKUd'
    if (ratio > 100) return 'Slightly Over-SKUd'
    if (ratio > 80) return 'Balanced'
    if (ratio > 60) return 'Under-represented'
    return 'Significantly Under-represented'
  }

  const skuData = [
    // Protein
    { segmentId: 'protein', channelId: 'Discounters', skuSharePct: 9.2, valueSharePct: 5.1 },
    { segmentId: 'protein', channelId: 'Regional Supers', skuSharePct: 8.8, valueSharePct: 5.5 },
    { segmentId: 'protein', channelId: 'National Supers', skuSharePct: 9.5, valueSharePct: 5.1 },
    { segmentId: 'protein', channelId: 'Hypers', skuSharePct: 8.4, valueSharePct: 5.3 },
    { segmentId: 'protein', channelId: 'Carrefour Hyper', skuSharePct: 9.0, valueSharePct: 5.2 },
    { segmentId: 'protein', channelId: 'Carrefour Super', skuSharePct: 8.5, valueSharePct: 5.4 },
    { segmentId: 'protein', channelId: 'Ahorramas', skuSharePct: 8.0, valueSharePct: 5.3 },
    { segmentId: 'protein', channelId: 'Mercadona', skuSharePct: 7.5, valueSharePct: 5.0 },
    // Kids
    { segmentId: 'kids', channelId: 'Discounters', skuSharePct: 5.6, valueSharePct: 3.5 },
    { segmentId: 'kids', channelId: 'Regional Supers', skuSharePct: 5.0, valueSharePct: 3.8 },
    { segmentId: 'kids', channelId: 'National Supers', skuSharePct: 5.4, valueSharePct: 3.6 },
    { segmentId: 'kids', channelId: 'Hypers', skuSharePct: 4.8, valueSharePct: 3.7 },
    { segmentId: 'kids', channelId: 'Carrefour Hyper', skuSharePct: 5.2, valueSharePct: 3.6 },
    { segmentId: 'kids', channelId: 'Carrefour Super', skuSharePct: 4.6, valueSharePct: 3.8 },
    { segmentId: 'kids', channelId: 'Ahorramas', skuSharePct: 4.4, valueSharePct: 3.7 },
    { segmentId: 'kids', channelId: 'Mercadona', skuSharePct: 4.2, valueSharePct: 3.5 },
    // Greek
    { segmentId: 'greek', channelId: 'Discounters', skuSharePct: 8.0, valueSharePct: 19.5 },
    { segmentId: 'greek', channelId: 'Regional Supers', skuSharePct: 10.2, valueSharePct: 19.0 },
    { segmentId: 'greek', channelId: 'National Supers', skuSharePct: 11.5, valueSharePct: 19.2 },
    { segmentId: 'greek', channelId: 'Hypers', skuSharePct: 13.0, valueSharePct: 19.4 },
    { segmentId: 'greek', channelId: 'Carrefour Hyper', skuSharePct: 13.7, valueSharePct: 19.1 },
    { segmentId: 'greek', channelId: 'Carrefour Super', skuSharePct: 11.0, valueSharePct: 19.3 },
    { segmentId: 'greek', channelId: 'Ahorramas', skuSharePct: 9.5, valueSharePct: 19.0 },
    { segmentId: 'greek', channelId: 'Mercadona', skuSharePct: 7.6, valueSharePct: 19.0 },
    // Immunity
    { segmentId: 'immunity', channelId: 'Discounters', skuSharePct: 8.6, valueSharePct: 15.9 },
    { segmentId: 'immunity', channelId: 'Regional Supers', skuSharePct: 10.4, valueSharePct: 15.5 },
    { segmentId: 'immunity', channelId: 'National Supers', skuSharePct: 12.0, valueSharePct: 16.0 },
    { segmentId: 'immunity', channelId: 'Hypers', skuSharePct: 14.2, valueSharePct: 15.8 },
    { segmentId: 'immunity', channelId: 'Carrefour Hyper', skuSharePct: 14.7, valueSharePct: 16.0 },
    { segmentId: 'immunity', channelId: 'Carrefour Super', skuSharePct: 11.5, valueSharePct: 15.7 },
    { segmentId: 'immunity', channelId: 'Ahorramas', skuSharePct: 10.0, valueSharePct: 15.6 },
    { segmentId: 'immunity', channelId: 'Mercadona', skuSharePct: 9.0, valueSharePct: 15.5 },
    // Bifidus
    { segmentId: 'bifidus', channelId: 'Discounters', skuSharePct: 27.7, valueSharePct: 16.0 },
    { segmentId: 'bifidus', channelId: 'Regional Supers', skuSharePct: 18.0, valueSharePct: 16.2 },
    { segmentId: 'bifidus', channelId: 'National Supers', skuSharePct: 16.5, valueSharePct: 16.0 },
    { segmentId: 'bifidus', channelId: 'Hypers', skuSharePct: 14.8, valueSharePct: 15.8 },
    { segmentId: 'bifidus', channelId: 'Carrefour Hyper', skuSharePct: 14.2, valueSharePct: 16.0 },
    { segmentId: 'bifidus', channelId: 'Carrefour Super', skuSharePct: 15.5, valueSharePct: 16.1 },
    { segmentId: 'bifidus', channelId: 'Ahorramas', skuSharePct: 16.0, valueSharePct: 15.9 },
    { segmentId: 'bifidus', channelId: 'Mercadona', skuSharePct: 13.6, valueSharePct: 16.0 },
    // Kefir
    { segmentId: 'kefir', channelId: 'Discounters', skuSharePct: 1.6, valueSharePct: 4.0 },
    { segmentId: 'kefir', channelId: 'Regional Supers', skuSharePct: 3.2, valueSharePct: 4.1 },
    { segmentId: 'kefir', channelId: 'National Supers', skuSharePct: 4.0, valueSharePct: 3.9 },
    { segmentId: 'kefir', channelId: 'Hypers', skuSharePct: 5.3, valueSharePct: 4.0 },
    { segmentId: 'kefir', channelId: 'Carrefour Hyper', skuSharePct: 5.0, valueSharePct: 4.1 },
    { segmentId: 'kefir', channelId: 'Carrefour Super', skuSharePct: 3.5, valueSharePct: 4.0 },
    { segmentId: 'kefir', channelId: 'Ahorramas', skuSharePct: 2.8, valueSharePct: 4.2 },
    { segmentId: 'kefir', channelId: 'Mercadona', skuSharePct: 2.0, valueSharePct: 4.0 },
    // Essentials/Kids
    { segmentId: 'essentials-kids', channelId: 'Discounters', skuSharePct: 28.0, valueSharePct: 30.0 },
    { segmentId: 'essentials-kids', channelId: 'Regional Supers', skuSharePct: 30.5, valueSharePct: 30.2 },
    { segmentId: 'essentials-kids', channelId: 'National Supers', skuSharePct: 29.0, valueSharePct: 30.0 },
    { segmentId: 'essentials-kids', channelId: 'Hypers', skuSharePct: 27.5, valueSharePct: 29.8 },
    { segmentId: 'essentials-kids', channelId: 'Carrefour Hyper', skuSharePct: 26.0, valueSharePct: 30.0 },
    { segmentId: 'essentials-kids', channelId: 'Carrefour Super', skuSharePct: 31.0, valueSharePct: 29.5 },
    { segmentId: 'essentials-kids', channelId: 'Ahorramas', skuSharePct: 35.0, valueSharePct: 30.0 },
    { segmentId: 'essentials-kids', channelId: 'Mercadona', skuSharePct: 36.0, valueSharePct: 30.0 },
    // Cholesterol
    { segmentId: 'cholesterol', channelId: 'Discounters', skuSharePct: 1.8, valueSharePct: 3.0 },
    { segmentId: 'cholesterol', channelId: 'Regional Supers', skuSharePct: 2.4, valueSharePct: 3.0 },
    { segmentId: 'cholesterol', channelId: 'National Supers', skuSharePct: 2.7, valueSharePct: 3.0 },
    { segmentId: 'cholesterol', channelId: 'Hypers', skuSharePct: 2.9, valueSharePct: 3.1 },
    { segmentId: 'cholesterol', channelId: 'Carrefour Hyper', skuSharePct: 2.9, valueSharePct: 3.0 },
    { segmentId: 'cholesterol', channelId: 'Carrefour Super', skuSharePct: 2.5, valueSharePct: 3.0 },
    { segmentId: 'cholesterol', channelId: 'Ahorramas', skuSharePct: 2.2, valueSharePct: 3.0 },
    { segmentId: 'cholesterol', channelId: 'Mercadona', skuSharePct: 1.5, valueSharePct: 3.0 },
    // Plant-Based
    { segmentId: 'plant-based', channelId: 'Discounters', skuSharePct: 2.8, valueSharePct: 5.0 },
    { segmentId: 'plant-based', channelId: 'Regional Supers', skuSharePct: 3.5, valueSharePct: 5.2 },
    { segmentId: 'plant-based', channelId: 'National Supers', skuSharePct: 4.0, valueSharePct: 5.0 },
    { segmentId: 'plant-based', channelId: 'Hypers', skuSharePct: 4.5, valueSharePct: 5.1 },
    { segmentId: 'plant-based', channelId: 'Carrefour Hyper', skuSharePct: 4.6, valueSharePct: 5.1 },
    { segmentId: 'plant-based', channelId: 'Carrefour Super', skuSharePct: 3.8, valueSharePct: 5.0 },
    { segmentId: 'plant-based', channelId: 'Ahorramas', skuSharePct: 3.2, valueSharePct: 5.0 },
    { segmentId: 'plant-based', channelId: 'Mercadona', skuSharePct: 2.8, valueSharePct: 5.0 },
    // Light
    { segmentId: 'light', channelId: 'Discounters', skuSharePct: 2.8, valueSharePct: 2.0 },
    { segmentId: 'light', channelId: 'Regional Supers', skuSharePct: 2.4, valueSharePct: 2.0 },
    { segmentId: 'light', channelId: 'National Supers', skuSharePct: 2.2, valueSharePct: 2.0 },
    { segmentId: 'light', channelId: 'Hypers', skuSharePct: 2.0, valueSharePct: 2.1 },
    { segmentId: 'light', channelId: 'Carrefour Hyper', skuSharePct: 1.9, valueSharePct: 2.0 },
    { segmentId: 'light', channelId: 'Carrefour Super', skuSharePct: 2.2, valueSharePct: 2.0 },
    { segmentId: 'light', channelId: 'Ahorramas', skuSharePct: 2.0, valueSharePct: 2.0 },
    { segmentId: 'light', channelId: 'Mercadona', skuSharePct: 1.8, valueSharePct: 2.0 },
  ]
  await prisma.sKUShareValue.deleteMany()
  for (const sv of skuData) {
    const ratio = Math.round((sv.skuSharePct / sv.valueSharePct) * 100)
    await prisma.sKUShareValue.create({
      data: {
        ...sv,
        gapPp: +(sv.skuSharePct - sv.valueSharePct).toFixed(1),
        assessment: assessSKU(ratio),
      },
    })
  }

  // ─── Assortment Recommendations ─────────────────────────────
  console.log('  Assortment Recommendations...')
  const assortmentRecs = [
    // Carrefour Hyper
    { retailerId: 'carrefour-hyper', segmentId: 'greek', actualSkuCount: 18, fairShareSkuCount: 28, listingOpps: 11, action: 'expand' },
    { retailerId: 'carrefour-hyper', segmentId: 'essentials-kids', actualSkuCount: 22, fairShareSkuCount: 23, listingOpps: 1, action: 'maintain' },
    { retailerId: 'carrefour-hyper', segmentId: 'cholesterol', actualSkuCount: 10, fairShareSkuCount: 36, listingOpps: 26, action: 'expand' },
    { retailerId: 'carrefour-hyper', segmentId: 'immunity', actualSkuCount: 16, fairShareSkuCount: 32, listingOpps: 17, action: 'expand' },
    { retailerId: 'carrefour-hyper', segmentId: 'plant-based', actualSkuCount: 30, fairShareSkuCount: 39, listingOpps: 10, action: 'expand' },
    { retailerId: 'carrefour-hyper', segmentId: 'bifidus', actualSkuCount: 35, fairShareSkuCount: 30, listingOpps: -5, action: 'rationalize' },
    { retailerId: 'carrefour-hyper', segmentId: 'protein', actualSkuCount: 28, fairShareSkuCount: 19, listingOpps: -9, action: 'rationalize' },
    { retailerId: 'carrefour-hyper', segmentId: 'kefir', actualSkuCount: 15, fairShareSkuCount: 12, listingOpps: -3, action: 'rationalize' },
    { retailerId: 'carrefour-hyper', segmentId: 'kids', actualSkuCount: 18, fairShareSkuCount: 12, listingOpps: -6, action: 'rationalize' },
    { retailerId: 'carrefour-hyper', segmentId: 'light', actualSkuCount: 17, fairShareSkuCount: 10, listingOpps: -7, action: 'rationalize' },
    // Carrefour Super
    { retailerId: 'carrefour-super', segmentId: 'greek', actualSkuCount: 8, fairShareSkuCount: 11, listingOpps: 3, action: 'expand' },
    { retailerId: 'carrefour-super', segmentId: 'essentials-kids', actualSkuCount: 18, fairShareSkuCount: 14, listingOpps: -4, action: 'rationalize' },
    { retailerId: 'carrefour-super', segmentId: 'cholesterol', actualSkuCount: 5, fairShareSkuCount: 8, listingOpps: 3, action: 'expand' },
    { retailerId: 'carrefour-super', segmentId: 'immunity', actualSkuCount: 10, fairShareSkuCount: 12, listingOpps: 2, action: 'expand' },
    { retailerId: 'carrefour-super', segmentId: 'plant-based', actualSkuCount: 12, fairShareSkuCount: 14, listingOpps: 2, action: 'expand' },
    { retailerId: 'carrefour-super', segmentId: 'bifidus', actualSkuCount: 18, fairShareSkuCount: 12, listingOpps: -6, action: 'rationalize' },
    { retailerId: 'carrefour-super', segmentId: 'protein', actualSkuCount: 14, fairShareSkuCount: 8, listingOpps: -6, action: 'rationalize' },
    { retailerId: 'carrefour-super', segmentId: 'kefir', actualSkuCount: 5, fairShareSkuCount: 5, listingOpps: 0, action: 'maintain' },
    { retailerId: 'carrefour-super', segmentId: 'kids', actualSkuCount: 6, fairShareSkuCount: 5, listingOpps: -1, action: 'maintain' },
    { retailerId: 'carrefour-super', segmentId: 'light', actualSkuCount: 5, fairShareSkuCount: 4, listingOpps: -1, action: 'rationalize' },
    // Ahorramas
    { retailerId: 'ahorramas', segmentId: 'greek', actualSkuCount: 7, fairShareSkuCount: 10, listingOpps: 3, action: 'expand' },
    { retailerId: 'ahorramas', segmentId: 'essentials-kids', actualSkuCount: 20, fairShareSkuCount: 15, listingOpps: -5, action: 'rationalize' },
    { retailerId: 'ahorramas', segmentId: 'cholesterol', actualSkuCount: 4, fairShareSkuCount: 7, listingOpps: 3, action: 'expand' },
    { retailerId: 'ahorramas', segmentId: 'immunity', actualSkuCount: 9, fairShareSkuCount: 11, listingOpps: 2, action: 'expand' },
    { retailerId: 'ahorramas', segmentId: 'plant-based', actualSkuCount: 10, fairShareSkuCount: 12, listingOpps: 2, action: 'expand' },
    { retailerId: 'ahorramas', segmentId: 'bifidus', actualSkuCount: 19, fairShareSkuCount: 13, listingOpps: -6, action: 'rationalize' },
    { retailerId: 'ahorramas', segmentId: 'protein', actualSkuCount: 13, fairShareSkuCount: 8, listingOpps: -5, action: 'rationalize' },
    { retailerId: 'ahorramas', segmentId: 'kefir', actualSkuCount: 5, fairShareSkuCount: 5, listingOpps: 0, action: 'maintain' },
    { retailerId: 'ahorramas', segmentId: 'kids', actualSkuCount: 7, fairShareSkuCount: 5, listingOpps: -2, action: 'rationalize' },
    { retailerId: 'ahorramas', segmentId: 'light', actualSkuCount: 5, fairShareSkuCount: 4, listingOpps: -1, action: 'rationalize' },
    // Mercadona
    { retailerId: 'mercadona', segmentId: 'greek', actualSkuCount: 2, fairShareSkuCount: 4, listingOpps: 2, action: 'expand' },
    { retailerId: 'mercadona', segmentId: 'essentials-kids', actualSkuCount: 4, fairShareSkuCount: 5, listingOpps: 1, action: 'maintain' },
    { retailerId: 'mercadona', segmentId: 'cholesterol', actualSkuCount: 2, fairShareSkuCount: 3, listingOpps: 1, action: 'expand' },
    { retailerId: 'mercadona', segmentId: 'immunity', actualSkuCount: 3, fairShareSkuCount: 5, listingOpps: 2, action: 'expand' },
    { retailerId: 'mercadona', segmentId: 'plant-based', actualSkuCount: 2, fairShareSkuCount: 4, listingOpps: 2, action: 'expand' },
    { retailerId: 'mercadona', segmentId: 'bifidus', actualSkuCount: 3, fairShareSkuCount: 3, listingOpps: 0, action: 'maintain' },
    { retailerId: 'mercadona', segmentId: 'protein', actualSkuCount: 2, fairShareSkuCount: 2, listingOpps: 0, action: 'maintain' },
    { retailerId: 'mercadona', segmentId: 'kefir', actualSkuCount: 1, fairShareSkuCount: 2, listingOpps: 1, action: 'expand' },
    { retailerId: 'mercadona', segmentId: 'kids', actualSkuCount: 1, fairShareSkuCount: 1, listingOpps: 0, action: 'maintain' },
    { retailerId: 'mercadona', segmentId: 'light', actualSkuCount: 0, fairShareSkuCount: 1, listingOpps: 1, action: 'expand' },
  ]
  await prisma.assortmentRecommendation.deleteMany()
  for (const ar of assortmentRecs) {
    await prisma.assortmentRecommendation.create({ data: ar })
  }

  console.log('\n✅ Seed complete! All data loaded.')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
