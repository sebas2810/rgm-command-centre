import type Anthropic from '@anthropic-ai/sdk'
import { prisma } from '../db/client.js'
import {
  brandElasticityMap,
  retailerElasticityModifiers,
  crossEffects,
  mechanicUplift,
  mechanicEfficiency,
} from '@rgm/shared'

type AsyncToolHandler = (input: Record<string, unknown>) => Promise<string>

export function createToolHandlers(): {
  definitions: Anthropic.Tool[]
  handlers: Record<string, AsyncToolHandler>
} {
  const definitions: Anthropic.Tool[] = [
    {
      name: 'calculate_price_impact',
      description: 'Calculate the financial impact of a price change for a specific brand at a specific retailer.',
      input_schema: {
        type: 'object' as const,
        properties: {
          brand_id: { type: 'string', description: 'Brand identifier (e.g. "activia", "oikos")' },
          retailer_id: { type: 'string', description: 'Retailer group (e.g. "carrefour", "mercadona")' },
          price_change_pct: { type: 'number', description: 'Price change percentage' },
        },
        required: ['brand_id', 'retailer_id', 'price_change_pct'],
      },
    },
    {
      name: 'simulate_cross_elasticity',
      description: 'Simulate cross-elasticity effects of a price change on competing brands.',
      input_schema: {
        type: 'object' as const,
        properties: {
          brand_id: { type: 'string', description: 'Brand being changed' },
          retailer_id: { type: 'string', description: 'Retailer context' },
          price_change_pct: { type: 'number', description: 'Price change percentage' },
        },
        required: ['brand_id', 'retailer_id', 'price_change_pct'],
      },
    },
    {
      name: 'evaluate_promo_scenario',
      description: 'Compare promotional mechanics and calculate ROI impact.',
      input_schema: {
        type: 'object' as const,
        properties: {
          brand_id: { type: 'string', description: 'Brand' },
          retailer_id: { type: 'string', description: 'Retailer' },
          current_mechanic: { type: 'string', description: 'Current promo type' },
          proposed_mechanic: { type: 'string', description: 'Proposed promo type' },
          frequency_change: { type: 'string', description: 'Optional frequency change' },
        },
        required: ['brand_id', 'retailer_id', 'current_mechanic', 'proposed_mechanic'],
      },
    },
    {
      name: 'get_segment_data',
      description: 'Retrieve segment performance data with brands, deviations, and targets.',
      input_schema: {
        type: 'object' as const,
        properties: {
          segment_id: { type: 'string', description: 'Segment identifier' },
        },
        required: ['segment_id'],
      },
    },
    {
      name: 'get_retailer_data',
      description: 'Retrieve retailer performance data with pricing, assortment, and promo efficiency.',
      input_schema: {
        type: 'object' as const,
        properties: {
          retailer_id: { type: 'string', description: 'Retailer group ID' },
        },
        required: ['retailer_id'],
      },
    },
    {
      name: 'get_deviation_details',
      description: 'Filter and list plan deviations with root causes.',
      input_schema: {
        type: 'object' as const,
        properties: {
          segment_id: { type: 'string', description: 'Optional segment filter' },
          retailer_id: { type: 'string', description: 'Optional retailer filter' },
          severity: { type: 'string', description: 'Optional severity filter' },
        },
        required: [],
      },
    },
    {
      name: 'calculate_building_blocks',
      description: 'Recalculate P&L waterfall with proposed changes to RGM levers.',
      input_schema: {
        type: 'object' as const,
        properties: {
          pricing_change_pp: { type: 'number', description: 'Change to pricing lever (pp)' },
          mix_change_pp: { type: 'number', description: 'Change to mix lever (pp)' },
          promo_change_pp: { type: 'number', description: 'Change to promo lever (pp)' },
          pack_change_pp: { type: 'number', description: 'Change to pack lever (pp)' },
          npd_change_pp: { type: 'number', description: 'Change to NPD lever (pp)' },
        },
        required: [],
      },
    },
    {
      name: 'generate_retailer_action_plan',
      description: 'Generate comprehensive action plan for a retailer.',
      input_schema: {
        type: 'object' as const,
        properties: {
          retailer_id: { type: 'string', description: 'Retailer group ID' },
          focus_areas: { type: 'string', description: 'Optional focus areas' },
        },
        required: ['retailer_id'],
      },
    },
    {
      name: 'assess_triple_win',
      description: 'Score a strategy for Consumer/Manufacturer/Retailer value.',
      input_schema: {
        type: 'object' as const,
        properties: {
          strategy_description: { type: 'string', description: 'Description of the strategy' },
          expected_volume_impact_pct: { type: 'number', description: 'Expected volume impact %' },
          expected_margin_impact_pp: { type: 'number', description: 'Expected margin impact pp' },
          expected_price_change_pct: { type: 'number', description: 'Expected price change %' },
        },
        required: ['strategy_description'],
      },
    },
    {
      name: 'get_plan_overview',
      description: 'Get full annual plan with KPIs, targets, building blocks, and deviation summary.',
      input_schema: {
        type: 'object' as const,
        properties: {},
        required: [],
      },
    },
  ]

  const handlers: Record<string, AsyncToolHandler> = {
    calculate_price_impact: async (input) => {
      const brandId = input.brand_id as string
      const retailerId = input.retailer_id as string
      const priceChangePct = input.price_change_pct as number

      const brand = await prisma.brand.findUnique({
        where: { id: brandId },
        include: { segment: true },
      })
      if (!brand) return JSON.stringify({ error: `Brand ${brandId} not found` })

      const baseElasticity = brandElasticityMap[brandId] ?? -1.5
      const retailerMod = retailerElasticityModifiers[retailerId] ?? 1.0
      const effectiveElasticity = baseElasticity * retailerMod
      const volumeChangePct = priceChangePct * effectiveElasticity
      const revenueChangePct = priceChangePct + volumeChangePct + (priceChangePct * volumeChangePct / 100)
      const brandSalesM = brand.segment.valueSalesM * (brand.sharePct / 100)
      const volumeImpactM = brandSalesM * (volumeChangePct / 100)
      const revenueImpactM = brandSalesM * (revenueChangePct / 100)
      const marginImpactPp = priceChangePct * 0.7 + volumeChangePct * 0.1

      return JSON.stringify({
        brand: brand.displayName,
        retailer: retailerId,
        price_change_pct: priceChangePct,
        elasticity: +effectiveElasticity.toFixed(2),
        volume_change_pct: +volumeChangePct.toFixed(1),
        revenue_change_pct: +revenueChangePct.toFixed(1),
        estimated_brand_sales_M: +brandSalesM.toFixed(1),
        volume_impact_M: +volumeImpactM.toFixed(2),
        revenue_impact_M: +revenueImpactM.toFixed(2),
        margin_impact_pp: +marginImpactPp.toFixed(1),
        current_gp_pct: brand.gpPct,
        projected_gp_pct: +(brand.gpPct + marginImpactPp).toFixed(1),
        note: retailerId === 'mercadona'
          ? 'Mercadona has elevated price sensitivity due to Hacendado private label dominance'
          : undefined,
      })
    },

    simulate_cross_elasticity: async (input) => {
      const brandId = input.brand_id as string
      const retailerId = input.retailer_id as string
      const priceChangePct = input.price_change_pct as number

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

    evaluate_promo_scenario: async (input) => {
      const brandId = input.brand_id as string
      const retailerId = input.retailer_id as string
      const currentMechanic = input.current_mechanic as string
      const proposedMechanic = input.proposed_mechanic as string

      const currentUp = mechanicUplift[currentMechanic] ?? 30
      const proposedUp = mechanicUplift[proposedMechanic] ?? 30
      const currentEff = mechanicEfficiency[currentMechanic] ?? 30
      const proposedEff = mechanicEfficiency[proposedMechanic] ?? 30

      return JSON.stringify({
        brand: brandId,
        retailer: retailerId,
        current_mechanic: currentMechanic,
        proposed_mechanic: proposedMechanic,
        current_avg_uplift_pct: currentUp,
        proposed_avg_uplift_pct: proposedUp,
        uplift_change_pct: proposedUp - currentUp,
        current_efficiency_pct: currentEff,
        proposed_efficiency_pct: proposedEff,
        efficiency_change_pct: proposedEff - currentEff,
        recommendation: proposedEff > currentEff
          ? `Switching to ${proposedMechanic} improves promo ROI by ${proposedEff - currentEff}pp`
          : `Switching to ${proposedMechanic} may reduce efficiency. Consider alternatives.`,
      })
    },

    get_segment_data: async (input) => {
      const segmentId = input.segment_id as string
      const segment = await prisma.segment.findUnique({
        where: { id: segmentId },
        include: {
          brands: true,
          deviations: true,
          segmentTargets: true,
        },
      })
      if (!segment) return JSON.stringify({ error: `Segment ${segmentId} not found` })
      return JSON.stringify(segment)
    },

    get_retailer_data: async (input) => {
      const retailerId = input.retailer_id as string
      const retailers = await prisma.retailer.findMany({
        where: { groupId: retailerId },
        include: {
          retailerPricing: { include: { brand: true } },
          assortmentRecs: true,
          promoEfficiency: true,
          promoRecs: true,
          deviations: true,
          retailerTargets: true,
        },
      })
      if (retailers.length === 0) return JSON.stringify({ error: `Retailer ${retailerId} not found` })
      return JSON.stringify(retailers)
    },

    get_deviation_details: async (input) => {
      const where: Record<string, unknown> = {}
      if (input.segment_id) where.segmentId = input.segment_id
      if (input.retailer_id) where.retailerId = input.retailer_id
      if (input.severity) where.severity = input.severity

      const devs = await prisma.deviation.findMany({
        where,
        include: { segment: true, retailer: true },
      })

      return JSON.stringify({
        total_deviations: devs.length,
        critical: devs.filter(d => d.severity === 'critical').length,
        warning: devs.filter(d => d.severity === 'warning').length,
        minor: devs.filter(d => d.severity === 'minor').length,
        deviations: devs,
      })
    },

    calculate_building_blocks: async (input) => {
      const blocks = await prisma.buildingBlock.findMany()
      const changes: Record<string, number> = {
        'NPD & Innovation': (input.npd_change_pp as number) ?? 0,
        'Consumer Pricing': (input.pricing_change_pp as number) ?? 0,
        'Promotional Mix': (input.promo_change_pp as number) ?? 0,
        'Pack Price Architecture': (input.pack_change_pp as number) ?? 0,
        'Active Mix': (input.mix_change_pp as number) ?? 0,
      }

      const updatedBlocks = blocks.map(block => {
        const change = changes[block.label] ?? 0
        if (change !== 0 && block.type !== 'subtotal') {
          return { ...block, valuePp: +(block.valuePp + change).toFixed(1), valueM: +(block.valueM + change * 19).toFixed(1) }
        }
        return block
      })

      const planGp = updatedBlocks.find(b => b.label === 'Plan GP')
      if (planGp) {
        const baseGp = updatedBlocks.find(b => b.label === 'Prior Year GP')
        const nonSubtotals = updatedBlocks.filter(b => b.type !== 'subtotal')
        const totalDelta = nonSubtotals.reduce((sum, b) => sum + b.valueM, 0)
        planGp.valueM = +((baseGp?.valueM ?? 360) + totalDelta).toFixed(1)
      }

      return JSON.stringify({ building_blocks: updatedBlocks })
    },

    generate_retailer_action_plan: async (input) => {
      const retailerId = input.retailer_id as string
      const retailers = await prisma.retailer.findMany({
        where: { groupId: retailerId },
        include: {
          retailerPricing: { include: { brand: true } },
          assortmentRecs: true,
          promoRecs: true,
          retailerTargets: true,
        },
      })

      return JSON.stringify({
        retailer: retailerId,
        retailers,
        pricing_recommendations: retailers.flatMap(r => r.retailerPricing),
        assortment_plan: retailers.flatMap(r => r.assortmentRecs),
        promo_recommendations: retailers.flatMap(r => r.promoRecs),
        context: {
          total_skus: retailers.reduce((sum, r) => sum + r.skuCount, 0),
          fair_share_skus: retailers.reduce((sum, r) => sum + r.fairShareSkuCount, 0),
          relationship: retailers[0]?.negotiationStatus,
          constraints: retailers[0]?.keyConstraints,
        },
      })
    },

    assess_triple_win: async (input) => {
      const volumeImpact = (input.expected_volume_impact_pct as number) ?? 0
      const marginImpact = (input.expected_margin_impact_pp as number) ?? 0
      const priceChange = (input.expected_price_change_pct as number) ?? 0

      const consumerScore = Math.max(0, Math.min(100, 70 - priceChange * 5 + volumeImpact * 2))
      const manufacturerScore = Math.max(0, Math.min(100, 50 + marginImpact * 8 + volumeImpact * 3))
      const retailerScore = Math.max(0, Math.min(100, 60 + volumeImpact * 4 + marginImpact * 2))
      const overall = Math.round((consumerScore + manufacturerScore + retailerScore) / 3)

      return JSON.stringify({
        strategy: input.strategy_description,
        triple_win: {
          consumer: { score: Math.round(consumerScore), label: consumerScore >= 65 ? 'Strong' : consumerScore >= 45 ? 'Moderate' : 'At Risk' },
          manufacturer: { score: Math.round(manufacturerScore), label: manufacturerScore >= 65 ? 'Strong' : manufacturerScore >= 45 ? 'Moderate' : 'At Risk' },
          retailer: { score: Math.round(retailerScore), label: retailerScore >= 65 ? 'Strong' : retailerScore >= 45 ? 'Moderate' : 'At Risk' },
          overall,
          verdict: overall >= 65 ? 'Balanced — creates value for all stakeholders'
            : overall >= 45 ? 'Mixed — some stakeholders at risk'
            : 'Unsustainable — significant value destruction',
        },
      })
    },

    get_plan_overview: async () => {
      const plan = await prisma.annualPlan.findFirst()
      const segmentTargets = await prisma.segmentTarget.findMany()
      const retailerTargets = await prisma.retailerTarget.findMany()
      const buildingBlocks = await prisma.buildingBlock.findMany()
      const deviations = await prisma.deviation.findMany()

      return JSON.stringify({
        plan,
        segment_targets: segmentTargets,
        retailer_targets: retailerTargets,
        building_blocks: buildingBlocks,
        deviations_summary: {
          total: deviations.length,
          critical: deviations.filter(d => d.severity === 'critical').length,
          warning: deviations.filter(d => d.severity === 'warning').length,
          positive: deviations.filter(d => d.severity === 'none').length,
        },
      })
    },
  }

  return { definitions, handlers }
}
