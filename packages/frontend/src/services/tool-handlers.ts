// Tool handlers execute locally in the browser using static data
// These are called when Claude uses tool_use and we need to return results

export type ToolHandler = (input: Record<string, unknown>) => string

export function createToolHandlers(data: DataContext): Record<string, ToolHandler> {
  return {
    calculate_price_impact: (input) => {
      const brandId = input.brand_id as string
      const retailerId = input.retailer_id as string
      const priceChangePct = input.price_change_pct as number

      const brand = data.brands.find(b => b.id === brandId)
      const segment = brand ? data.segments.find(s => s.id === brand.segmentId) : null

      if (!brand || !segment) {
        return JSON.stringify({ error: `Brand ${brandId} not found` })
      }

      // Simplified elasticity model based on cross-elasticity data
      const elasticityMap: Record<string, number> = {
        'activia': -1.8,
        'oikos': -1.5,
        'griego': -1.2,
        'yopro': -1.3,
        'danone': -2.0,
        'actimel': -0.8,
        'danacol': -0.6,
        'alpro': -1.1,
        'vitalinea': -1.6,
        'danonino': -1.4,
        'proteina': -1.9,
        'natillas': -2.1,
      }

      // Retailer modifiers
      const retailerModifiers: Record<string, number> = {
        'carrefour': 1.0,
        'ahorramas': 0.9,
        'mercadona': 1.4,  // Hacendado makes consumers more price sensitive
        'discounters': 1.3,
      }

      const baseElasticity = elasticityMap[brandId] ?? -1.5
      const retailerMod = retailerModifiers[retailerId] ?? 1.0
      const effectiveElasticity = baseElasticity * retailerMod

      const volumeChangePct = priceChangePct * effectiveElasticity
      const revenueChangePct = priceChangePct + volumeChangePct + (priceChangePct * volumeChangePct / 100)

      const brandSalesM = segment.valueSalesM * (brand.sharePct / 100)
      const volumeImpactM = brandSalesM * (volumeChangePct / 100)
      const revenueImpactM = brandSalesM * (revenueChangePct / 100)
      const marginImpactPp = priceChangePct * 0.7 + volumeChangePct * 0.1 // simplified

      return JSON.stringify({
        brand: brand.displayName,
        retailer: retailerId,
        price_change_pct: priceChangePct,
        elasticity: effectiveElasticity.toFixed(2),
        volume_change_pct: +volumeChangePct.toFixed(1),
        revenue_change_pct: +revenueChangePct.toFixed(1),
        estimated_brand_sales_M: +brandSalesM.toFixed(1),
        volume_impact_M: +volumeImpactM.toFixed(2),
        revenue_impact_M: +revenueImpactM.toFixed(2),
        margin_impact_pp: +marginImpactPp.toFixed(1),
        current_gp_pct: brand.gpPct,
        projected_gp_pct: +(brand.gpPct + marginImpactPp).toFixed(1),
        note: retailerId === 'mercadona'
          ? 'Mercadona has elevated price sensitivity due to Hacendado private label dominance (Revenue Index 123)'
          : undefined,
      })
    },

    simulate_cross_elasticity: (input) => {
      const brandId = input.brand_id as string
      const retailerId = input.retailer_id as string
      const priceChangePct = input.price_change_pct as number

      const crossEffects: Record<string, Record<string, number>> = {
        'activia': { 'oikos': 0.15, 'griego': 0.25, 'danone': 0.10, 'hacendado': 0.30 },
        'oikos': { 'activia': 0.10, 'griego': 0.35, 'pastoret': 0.20, 'hacendado': 0.15 },
        'actimel': { 'danacol': 0.05, 'hacendado': 0.20, 'nestle': 0.15 },
        'yopro': { 'proteina': 0.30, 'hacendado': 0.25, 'nestle': 0.10 },
      }

      const brandEffects = crossEffects[brandId] ?? {}
      const results = Object.entries(brandEffects).map(([affectedBrand, crossCoeff]) => {
        const volumeShift = priceChangePct * crossCoeff
        return {
          affected_brand: affectedBrand,
          volume_shift_pct: +(priceChangePct > 0 ? volumeShift : -volumeShift).toFixed(1),
          direction: priceChangePct > 0 ? 'gains volume (trade-down)' : 'loses volume (trade-up)',
          cross_elasticity_coefficient: crossCoeff,
        }
      })

      return JSON.stringify({
        source_brand: brandId,
        retailer: retailerId,
        price_change_pct: priceChangePct,
        cross_effects: results,
        net_category_impact: priceChangePct > 0
          ? 'Slight category volume decline as some consumers leave category'
          : 'Slight category volume growth from increased accessibility',
      })
    },

    evaluate_promo_scenario: (input) => {
      const brandId = input.brand_id as string
      const retailerId = input.retailer_id as string
      const currentMechanic = input.current_mechanic as string
      const proposedMechanic = input.proposed_mechanic as string

      const mechanicUplift: Record<string, number> = {
        '2nd-50pct': 60,
        'bogof': 120,
        'tpr-10-20': 30,
        'tpr-25-35': 15,
        'tpr-40plus': 10,
        'multi-buy': 80,
        'loyalty': 25,
        'sampling': 40,
      }

      const mechanicEfficiency: Record<string, number> = {
        '2nd-50pct': 200,
        'bogof': 150,
        'tpr-10-20': 40,
        'tpr-25-35': 25,
        'tpr-40plus': -10,
        'multi-buy': 180,
        'loyalty': 90,
        'sampling': 60,
      }

      const currentUplift = mechanicUplift[currentMechanic] ?? 30
      const proposedUplift = mechanicUplift[proposedMechanic] ?? 30
      const currentEfficiency = mechanicEfficiency[currentMechanic] ?? 30
      const proposedEfficiency = mechanicEfficiency[proposedMechanic] ?? 30

      return JSON.stringify({
        brand: brandId,
        retailer: retailerId,
        current_mechanic: currentMechanic,
        proposed_mechanic: proposedMechanic,
        current_avg_uplift_pct: currentUplift,
        proposed_avg_uplift_pct: proposedUplift,
        uplift_change_pct: proposedUplift - currentUplift,
        current_efficiency_pct: currentEfficiency,
        proposed_efficiency_pct: proposedEfficiency,
        efficiency_change_pct: proposedEfficiency - currentEfficiency,
        recommendation: proposedEfficiency > currentEfficiency
          ? `Switching to ${proposedMechanic} is expected to improve promo ROI by ${proposedEfficiency - currentEfficiency}pp`
          : `Switching to ${proposedMechanic} may reduce efficiency. Consider alternative mechanics.`,
        key_insight: 'Multi-buys and bundle mechanics consistently outperform straight TPR discounts in the Spanish yogurt market',
      })
    },

    get_segment_data: (input) => {
      const segmentId = input.segment_id as string
      const segment = data.segments.find(s => s.id === segmentId)
      if (!segment) return JSON.stringify({ error: `Segment ${segmentId} not found` })

      const segmentBrands = data.brands.filter(b => b.segmentId === segmentId)
      const segmentDeviations = data.deviations.filter(d => d.segmentId === segmentId)

      return JSON.stringify({
        segment,
        brands: segmentBrands.map(b => ({
          name: b.displayName,
          share: b.sharePct,
          shareDelta: b.shareDeltaPp,
          gp: b.gpPct,
          role: b.role,
          strategy: b.strategy,
        })),
        deviations: segmentDeviations,
        plan_target: data.segmentTargets.find(t => t.segmentId === segmentId),
      })
    },

    get_retailer_data: (input) => {
      const retailerId = input.retailer_id as string
      const retailers = data.retailers.filter(r => r.groupId === retailerId)
      const retailerDeviations = data.deviations.filter(d => d.retailerId === retailerId)
      const retailerTarget = data.retailerTargets.find(t => t.retailerId === retailerId)

      return JSON.stringify({
        retailers,
        target: retailerTarget,
        deviations: retailerDeviations,
        pricing: data.pricingByRetailer.filter(p => p.retailerId === retailerId),
        assortment: data.assortmentRecommendations.filter(a => a.retailerId === retailerId),
        promoEfficiency: data.promoEfficiency.filter(p => p.retailerId === retailerId),
      })
    },

    get_deviation_details: (input) => {
      let devs = [...data.deviations]
      if (input.segment_id) devs = devs.filter(d => d.segmentId === input.segment_id)
      if (input.retailer_id) devs = devs.filter(d => d.retailerId === input.retailer_id)
      if (input.severity) devs = devs.filter(d => d.severity === input.severity)

      return JSON.stringify({
        total_deviations: devs.length,
        critical: devs.filter(d => d.severity === 'critical').length,
        warning: devs.filter(d => d.severity === 'warning').length,
        minor: devs.filter(d => d.severity === 'minor').length,
        deviations: devs,
      })
    },

    calculate_building_blocks: (input) => {
      const baseBlocks = [...data.buildingBlocks]
      const changes = {
        'NPD & Innovation': (input.npd_change_pp as number) ?? 0,
        'Consumer Pricing': (input.pricing_change_pp as number) ?? 0,
        'Promotional Mix': (input.promo_change_pp as number) ?? 0,
        'Pack Price Architecture': (input.pack_change_pp as number) ?? 0,
        'Active Mix': (input.mix_change_pp as number) ?? 0,
      }

      const updatedBlocks = baseBlocks.map(block => {
        const change = changes[block.label as keyof typeof changes] ?? 0
        if (change !== 0 && block.type !== 'subtotal') {
          return { ...block, valuePp: +(block.valuePp + change).toFixed(1), valueM: +(block.valueM + change * 19).toFixed(1) }
        }
        return block
      })

      // Recalculate plan GP subtotal
      const planGp = updatedBlocks.find(b => b.label === 'Plan GP')
      if (planGp) {
        const baseGp = updatedBlocks.find(b => b.label === 'Prior Year GP')
        const nonSubtotals = updatedBlocks.filter(b => b.type !== 'subtotal')
        const totalDelta = nonSubtotals.reduce((sum, b) => sum + b.valueM, 0)
        planGp.valueM = +((baseGp?.valueM ?? 360) + totalDelta).toFixed(1)
      }

      return JSON.stringify({ building_blocks: updatedBlocks })
    },

    generate_retailer_action_plan: (input) => {
      const retailerId = input.retailer_id as string
      const retailers = data.retailers.filter(r => r.groupId === retailerId)
      const target = data.retailerTargets.find(t => t.retailerId === retailerId)
      const pricing = data.pricingByRetailer.filter(p => p.retailerId === retailerId)
      const assortment = data.assortmentRecommendations.filter(a => a.retailerId === retailerId)
      const promoRecs = data.promoRecommendations.filter(p => p.retailerId === retailerId)

      return JSON.stringify({
        retailer: retailerId,
        retailers,
        target,
        pricing_recommendations: pricing,
        assortment_plan: assortment,
        promo_recommendations: promoRecs,
        context: {
          total_skus: retailers.reduce((sum, r) => sum + r.skuCount, 0),
          fair_share_skus: retailers.reduce((sum, r) => sum + r.fairShareSkuCount, 0),
          relationship: retailers[0]?.negotiationStatus,
          constraints: retailers[0]?.keyConstraints,
        },
      })
    },

    assess_triple_win: (input) => {
      const volumeImpact = (input.expected_volume_impact_pct as number) ?? 0
      const marginImpact = (input.expected_margin_impact_pp as number) ?? 0
      const priceChange = (input.expected_price_change_pct as number) ?? 0

      const consumerScore = Math.max(0, Math.min(100,
        70 - priceChange * 5 + volumeImpact * 2
      ))
      const manufacturerScore = Math.max(0, Math.min(100,
        50 + marginImpact * 8 + volumeImpact * 3
      ))
      const retailerScore = Math.max(0, Math.min(100,
        60 + volumeImpact * 4 + marginImpact * 2
      ))

      const overall = Math.round((consumerScore + manufacturerScore + retailerScore) / 3)

      return JSON.stringify({
        strategy: input.strategy_description,
        triple_win: {
          consumer: { score: Math.round(consumerScore), label: consumerScore >= 65 ? 'Strong' : consumerScore >= 45 ? 'Moderate' : 'At Risk' },
          manufacturer: { score: Math.round(manufacturerScore), label: manufacturerScore >= 65 ? 'Strong' : manufacturerScore >= 45 ? 'Moderate' : 'At Risk' },
          retailer: { score: Math.round(retailerScore), label: retailerScore >= 65 ? 'Strong' : retailerScore >= 45 ? 'Moderate' : 'At Risk' },
          overall,
          verdict: overall >= 65 ? 'Balanced — creates value for all stakeholders'
            : overall >= 45 ? 'Mixed — some stakeholders at risk, consider lever rebalancing'
            : 'Unsustainable — significant value destruction for one or more stakeholders',
        },
      })
    },

    get_plan_overview: () => {
      return JSON.stringify({
        plan: {
          year: data.annualPlan.year,
          category: data.annualPlan.category,
          market: data.annualPlan.market,
          status: data.annualPlan.status,
          kpis: data.annualPlan.overallKPIs,
        },
        segment_targets: data.segmentTargets,
        retailer_targets: data.retailerTargets,
        building_blocks: data.buildingBlocks,
        deviations_summary: {
          total: data.deviations.length,
          critical: data.deviations.filter(d => d.severity === 'critical').length,
          warning: data.deviations.filter(d => d.severity === 'warning').length,
          positive: data.deviations.filter(d => d.severity === 'none').length,
        },
      })
    },
  }
}

// Data context shape — populated from danone data modules
export interface DataContext {
  segments: Array<{ id: string; name: string; valueSalesM: number; [key: string]: unknown }>
  brands: Array<{ id: string; displayName: string; segmentId: string; sharePct: number; shareDeltaPp: number; gpPct: number; role: string; strategy: string; [key: string]: unknown }>
  retailers: Array<{ id: string; groupId: string; skuCount: number; fairShareSkuCount: number; negotiationStatus: string; keyConstraints: string[]; [key: string]: unknown }>
  deviations: Array<{ id: string; segmentId: string; retailerId?: string; severity: string; [key: string]: unknown }>
  segmentTargets: Array<{ segmentId: string; [key: string]: unknown }>
  retailerTargets: Array<{ retailerId: string; [key: string]: unknown }>
  buildingBlocks: Array<{ label: string; valuePp: number; valueM: number; type: string; [key: string]: unknown }>
  annualPlan: { year: number; category: string; market: string; status: string; overallKPIs: Record<string, unknown> }
  pricingByRetailer: Array<{ retailerId: string; [key: string]: unknown }>
  assortmentRecommendations: Array<{ retailerId: string; [key: string]: unknown }>
  promoEfficiency: Array<{ retailerId: string; [key: string]: unknown }>
  promoRecommendations: Array<{ retailerId: string; [key: string]: unknown }>
}
