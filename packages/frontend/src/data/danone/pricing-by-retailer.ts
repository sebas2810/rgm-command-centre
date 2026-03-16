import type { RetailerPricing } from '../../types/pricing'

export const pricingByRetailer: RetailerPricing[] = [
  // ── Activia Bifidus ──────────────────────────────────────────────
  {
    brandId: 'activia',
    retailerId: 'carrefour',
    currentIndex: 198,
    recommendedIndex: 200,
    competitiveness: 'Competitive',
    rationale: 'Within corridor; slight room to close gap to 200 ceiling',
  },
  {
    brandId: 'activia',
    retailerId: 'ahorramas',
    currentIndex: 207,
    recommendedIndex: 203,
    competitiveness: 'Uncompetitive',
    rationale: 'Above corridor ceiling; losing volume to Hacendado shelf neighbor',
  },
  {
    brandId: 'activia',
    retailerId: 'mercadona',
    currentIndex: 265,
    recommendedIndex: 265,
    competitiveness: 'Competitive',
    rationale: 'Mercadona fixed-price constraint; no flexibility but margin holds',
  },

  // ── Oikos Greek ──────────────────────────────────────────────────
  {
    brandId: 'oikos',
    retailerId: 'carrefour',
    currentIndex: 268,
    recommendedIndex: 265,
    competitiveness: 'Uncompetitive',
    rationale: 'Slightly above corridor; Pastoret closing gap at 255',
  },
  {
    brandId: 'oikos',
    retailerId: 'ahorramas',
    currentIndex: 275,
    recommendedIndex: 270,
    competitiveness: 'Uncompetitive',
    rationale: 'Premium stretch too wide vs regional PL alternatives',
  },
  {
    brandId: 'oikos',
    retailerId: 'mercadona',
    currentIndex: 204,
    recommendedIndex: 202,
    competitiveness: 'Competitive',
    rationale: 'Griego format; tight corridor but within range',
  },

  // ── Danone Essentials ────────────────────────────────────────────
  {
    brandId: 'danone',
    retailerId: 'carrefour',
    currentIndex: 118,
    recommendedIndex: 115,
    competitiveness: 'Uncompetitive',
    rationale: 'PL at 100; gap too narrow to justify brand premium',
  },
  {
    brandId: 'danone',
    retailerId: 'ahorramas',
    currentIndex: 112,
    recommendedIndex: 115,
    competitiveness: 'Over-competitive',
    rationale: 'Below corridor floor; eroding brand value perception',
  },
  {
    brandId: 'danone',
    retailerId: 'mercadona',
    currentIndex: 120,
    recommendedIndex: 120,
    competitiveness: 'Competitive',
    rationale: 'Fixed shelf price; aligned with corridor ceiling',
  },

  // ── YoPRO Protein ────────────────────────────────────────────────
  {
    brandId: 'yopro' as any,
    retailerId: 'carrefour',
    currentIndex: 135,
    recommendedIndex: 138,
    competitiveness: 'Over-competitive',
    rationale: 'Below corridor; functional premium under-captured',
  },
  {
    brandId: 'yopro' as any,
    retailerId: 'ahorramas',
    currentIndex: 142,
    recommendedIndex: 140,
    competitiveness: 'Competitive',
    rationale: 'Within corridor; protein shoppers less price-sensitive',
  },
  {
    brandId: 'yopro' as any,
    retailerId: 'mercadona',
    currentIndex: 130,
    recommendedIndex: 135,
    competitiveness: 'Over-competitive',
    rationale: 'Mercadona price point below potential; margin opportunity',
  },

  // ── Actimel Immunity ─────────────────────────────────────────────
  {
    brandId: 'actimel',
    retailerId: 'carrefour',
    currentIndex: 220,
    recommendedIndex: 225,
    competitiveness: 'Over-competitive',
    rationale: 'Room to push toward ceiling; brand ritual supports premium',
  },
  {
    brandId: 'actimel',
    retailerId: 'ahorramas',
    currentIndex: 228,
    recommendedIndex: 225,
    competitiveness: 'Competitive',
    rationale: 'At corridor ceiling; holding price leadership',
  },
  {
    brandId: 'actimel',
    retailerId: 'mercadona',
    currentIndex: 215,
    recommendedIndex: 220,
    competitiveness: 'Over-competitive',
    rationale: 'Slightly below optimal; constrained by Mercadona margin rules',
  },

  // ── Danacol Cholesterol ──────────────────────────────────────────
  {
    brandId: 'danacol',
    retailerId: 'carrefour',
    currentIndex: 168,
    recommendedIndex: 170,
    competitiveness: 'Competitive',
    rationale: 'Near ceiling; near-monopoly allows price leadership',
  },
  {
    brandId: 'danacol',
    retailerId: 'ahorramas',
    currentIndex: 165,
    recommendedIndex: 168,
    competitiveness: 'Over-competitive',
    rationale: 'Below corridor; regional margin opportunity exists',
  },
  {
    brandId: 'danacol',
    retailerId: 'mercadona',
    currentIndex: 162,
    recommendedIndex: 165,
    competitiveness: 'Over-competitive',
    rationale: 'Slightly below corridor; clinical brand equity under-monetized',
  },

  // ── Alpro Plant-Based ────────────────────────────────────────────
  {
    brandId: 'alpro',
    retailerId: 'carrefour',
    currentIndex: 155,
    recommendedIndex: 155,
    competitiveness: 'Competitive',
    rationale: 'Mid-corridor; sustainability premium well-positioned',
  },
  {
    brandId: 'alpro',
    retailerId: 'ahorramas',
    currentIndex: 162,
    recommendedIndex: 158,
    competitiveness: 'Uncompetitive',
    rationale: 'Above corridor; plant-based shoppers switching to PL',
  },
  {
    brandId: 'alpro',
    retailerId: 'mercadona',
    currentIndex: 148,
    recommendedIndex: 150,
    competitiveness: 'Over-competitive',
    rationale: 'Below corridor; Hacendado vegetal at 100 compresses range',
  },

  // ── Vitalinea Light ──────────────────────────────────────────────
  {
    brandId: 'vitalinea',
    retailerId: 'carrefour',
    currentIndex: 108,
    recommendedIndex: 112,
    competitiveness: 'Over-competitive',
    rationale: 'Below corridor floor; declining segment needs margin focus',
  },
  {
    brandId: 'vitalinea',
    retailerId: 'ahorramas',
    currentIndex: 115,
    recommendedIndex: 112,
    competitiveness: 'Uncompetitive',
    rationale: 'Above corridor; PL light alternatives at 95',
  },
  {
    brandId: 'vitalinea',
    retailerId: 'mercadona',
    currentIndex: 110,
    recommendedIndex: 112,
    competitiveness: 'Competitive',
    rationale: 'Close to corridor center; stable but declining category',
  },

  // ── Danonino Kids ────────────────────────────────────────────────
  {
    brandId: 'danonino',
    retailerId: 'carrefour',
    currentIndex: 158,
    recommendedIndex: 155,
    competitiveness: 'Uncompetitive',
    rationale: 'Above corridor; parents switching to PL petit suisse',
  },
  {
    brandId: 'danonino',
    retailerId: 'ahorramas',
    currentIndex: 152,
    recommendedIndex: 155,
    competitiveness: 'Over-competitive',
    rationale: 'Below corridor; promo-driven pricing leaking margin',
  },
  {
    brandId: 'danonino',
    retailerId: 'mercadona',
    currentIndex: 145,
    recommendedIndex: 148,
    competitiveness: 'Over-competitive',
    rationale: 'Below corridor; Hacendado petit suisse at 85 compresses range',
  },
]
