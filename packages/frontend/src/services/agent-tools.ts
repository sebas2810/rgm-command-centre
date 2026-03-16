import type { ToolDefinition } from './claude-client'

export const rgmTools: ToolDefinition[] = [
  {
    name: 'calculate_price_impact',
    description: 'Calculate the financial impact of a price change for a specific brand at a specific retailer. Uses cross-elasticity data to estimate volume change, revenue impact, and margin effect. Returns a detailed breakdown.',
    input_schema: {
      type: 'object' as const,
      properties: {
        brand_id: { type: 'string', description: 'Brand identifier (e.g. "activia", "oikos", "actimel")' },
        retailer_id: { type: 'string', description: 'Retailer group (e.g. "carrefour", "mercadona", "ahorramas")' },
        price_change_pct: { type: 'number', description: 'Price change percentage (e.g. 5 for +5%, -3 for -3%)' },
      },
      required: ['brand_id', 'retailer_id', 'price_change_pct'],
    },
  },
  {
    name: 'simulate_cross_elasticity',
    description: 'Simulate the cross-elasticity effects of a price change on one brand affecting other brands at the same retailer. Shows cannibalization and trade-up/down effects.',
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
    description: 'Evaluate a promotional scenario: switching mechanic type, changing frequency, or adjusting depth. Returns expected volume uplift, ROI, and profitability impact.',
    input_schema: {
      type: 'object' as const,
      properties: {
        brand_id: { type: 'string', description: 'Brand for the promotion' },
        retailer_id: { type: 'string', description: 'Retailer' },
        current_mechanic: { type: 'string', description: 'Current promo mechanic (e.g. "tpr-25-35", "2nd-50pct", "bogof")' },
        proposed_mechanic: { type: 'string', description: 'Proposed new mechanic' },
        frequency_change: { type: 'string', description: 'Frequency change: "increase", "decrease", or "maintain"' },
      },
      required: ['brand_id', 'retailer_id', 'current_mechanic', 'proposed_mechanic'],
    },
  },
  {
    name: 'get_segment_data',
    description: 'Get detailed data for a specific segment including performance metrics, brand breakdown, pricing, and competitive landscape.',
    input_schema: {
      type: 'object' as const,
      properties: {
        segment_id: { type: 'string', description: 'Segment identifier (e.g. "bifidus", "greek", "immunity")' },
      },
      required: ['segment_id'],
    },
  },
  {
    name: 'get_retailer_data',
    description: 'Get detailed data for a specific retailer including performance vs plan, pricing positions, promo efficiency, and assortment gaps.',
    input_schema: {
      type: 'object' as const,
      properties: {
        retailer_id: { type: 'string', description: 'Retailer group identifier' },
      },
      required: ['retailer_id'],
    },
  },
  {
    name: 'get_deviation_details',
    description: 'Get details about plan deviations, including root causes and recommended actions.',
    input_schema: {
      type: 'object' as const,
      properties: {
        segment_id: { type: 'string', description: 'Optional segment filter' },
        retailer_id: { type: 'string', description: 'Optional retailer filter' },
        severity: { type: 'string', description: 'Optional severity filter: "critical", "warning", "minor"' },
      },
      required: [],
    },
  },
  {
    name: 'calculate_building_blocks',
    description: 'Recalculate the P&L building block bridge given a set of proposed changes (pricing, mix, promo, pack architecture). Returns the updated waterfall.',
    input_schema: {
      type: 'object' as const,
      properties: {
        pricing_change_pp: { type: 'number', description: 'Change to pricing building block in pp' },
        mix_change_pp: { type: 'number', description: 'Change to mix building block in pp' },
        promo_change_pp: { type: 'number', description: 'Change to promo building block in pp' },
        pack_change_pp: { type: 'number', description: 'Change to pack architecture building block in pp' },
        npd_change_pp: { type: 'number', description: 'Change to NPD building block in pp' },
      },
      required: [],
    },
  },
  {
    name: 'generate_retailer_action_plan',
    description: 'Generate a comprehensive action plan for a specific retailer including pricing recommendations, assortment changes, promo calendar optimization, and trade narrative.',
    input_schema: {
      type: 'object' as const,
      properties: {
        retailer_id: { type: 'string', description: 'Retailer to generate plan for' },
        focus_areas: {
          type: 'array',
          items: { type: 'string' },
          description: 'Areas to focus on: "pricing", "assortment", "promotions", "pack-architecture", "all"',
        },
      },
      required: ['retailer_id'],
    },
  },
  {
    name: 'assess_triple_win',
    description: 'Assess the Triple Win impact of a proposed strategy: scores for Consumer (value, accessibility), Manufacturer (margin, growth), and Retailer (category growth, trade margin).',
    input_schema: {
      type: 'object' as const,
      properties: {
        strategy_description: { type: 'string', description: 'Brief description of the strategy to assess' },
        expected_volume_impact_pct: { type: 'number', description: 'Expected volume impact %' },
        expected_margin_impact_pp: { type: 'number', description: 'Expected margin impact in pp' },
        expected_price_change_pct: { type: 'number', description: 'Average price change %' },
      },
      required: ['strategy_description'],
    },
  },
  {
    name: 'get_plan_overview',
    description: 'Get the full annual plan overview including KPIs, segment targets, retailer targets, building blocks, and current deviations summary.',
    input_schema: {
      type: 'object' as const,
      properties: {},
      required: [],
    },
  },
]
