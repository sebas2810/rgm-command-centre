import type { PromoRecommendation } from '../../types/promo'

// ── Promo Recommendations per Retailer (Danone reference p.45) ──────────────

export const promoRecommendations: PromoRecommendation[] = [
  // ── Carrefour ──
  {
    retailerId: 'carrefour',
    area: 'Price Points',
    recommendation: '2\u20AC is a common killer price point across segments. Anchor all 4-pack promotions around this threshold to maximize conversion.',
    impact: 'Maintains price perception while protecting margin corridor',
  },
  {
    retailerId: 'carrefour',
    area: 'Depth Of Deal',
    recommendation: 'Increasing depth doesn\u2019t improve incrementality except for Danacol. Cap standard discounts at 25% and reserve deep cuts for Danacol pantry-loading events only.',
    impact: 'Reduces margin erosion by ~3pp across Activia and Actimel',
  },
  {
    retailerId: 'carrefour',
    area: 'Mechanics',
    recommendation: 'Multi-buys (BOGOF, 2nd@50%) deliver significantly more uplift than straight discounts. Shift 40% of TPR budget to multi-buy mechanics.',
    impact: 'Expected +15-25% incremental uplift per promo event',
  },
  {
    retailerId: 'carrefour',
    area: 'Frequency',
    recommendation: 'Reduce promo frequency to improve profitability. Prioritize fewer, larger multi-buy events over continuous TPR windows.',
    impact: 'Improves promo ROI by reducing stock-up / pantry-loading cannibalization',
  },
  {
    retailerId: 'carrefour',
    area: 'Seasonality',
    recommendation: 'No meaningful seasonality for yogurt in Spain. Distribute promo events evenly across the year rather than concentrating in Q1/Q4.',
    impact: 'Smoother demand curve, reduced supply chain volatility',
  },
  {
    retailerId: 'carrefour',
    area: 'Visibility',
    recommendation: 'Feature + Display = 2-2.5x amplification of promo event. Always pair promotional pricing with secondary display and leaflet feature.',
    impact: 'Doubles incremental volume per euro of trade spend',
  },

  // ── Ahorramas ──
  {
    retailerId: 'ahorramas',
    area: 'Price Points',
    recommendation: '1.50\u20AC and 2\u20AC are the dominant killer price points. Use 1.50\u20AC for Essentials/Griego and 2\u20AC for premium brands.',
    impact: 'Aligns with shopper price sensitivity in regional super format',
  },
  {
    retailerId: 'ahorramas',
    area: 'Depth Of Deal',
    recommendation: 'Reduce average promo depth from 35% to 20%. Deep discounts on Activia at Ahorramas show negative value uplift (-75%).',
    impact: 'Recovers estimated \u20AC400K margin annually on Activia alone',
  },
  {
    retailerId: 'ahorramas',
    area: 'Mechanics',
    recommendation: 'Introduce 2nd@50% mechanic for Actimel and Danacol. Replace straight TPR events which show diminishing returns.',
    impact: 'Expected +30-40% volume uplift improvement vs current TPR',
  },
  {
    retailerId: 'ahorramas',
    area: 'Frequency',
    recommendation: 'Activia is over-promoted at 37% VSOD. Reduce Activia promo weeks from 19 to 12 per year and reinvest in Danacol.',
    impact: 'Shifts spend from inefficient (Activia) to efficient (Danacol) brands',
  },
  {
    retailerId: 'ahorramas',
    area: 'Seasonality',
    recommendation: 'Align Danonino promotions with back-to-school (Sep) and Easter periods for maximum family purchase relevance.',
    impact: 'Concentrates kids spend in peak consumption windows',
  },
  {
    retailerId: 'ahorramas',
    area: 'Visibility',
    recommendation: 'Negotiate end-cap displays for multi-buy events. Ahorramas stores with secondary displays show 1.8x promo lift.',
    impact: 'Improves in-store visibility without additional discount depth',
  },

  // ── Mercadona ──
  {
    retailerId: 'mercadona',
    area: 'Price Points',
    recommendation: 'Mercadona EDLP model limits promotional pricing. Focus on everyday shelf price competitiveness at 2\u20AC and 3\u20AC thresholds.',
    impact: 'Maintains listings in EDLP environment',
  },
  {
    retailerId: 'mercadona',
    area: 'Depth Of Deal',
    recommendation: 'Minimal promo depth possible in Mercadona format. Focus on pack-size/price architecture rather than temporary discounts.',
    impact: 'Better long-term price positioning vs Hacendado PL',
  },
  {
    retailerId: 'mercadona',
    area: 'Mechanics',
    recommendation: 'Limited mechanic options in Mercadona. Leverage new product introductions and innovation launches as primary activation tool.',
    impact: 'Innovation-led growth compensates for limited promotional flexibility',
  },
  {
    retailerId: 'mercadona',
    area: 'Frequency',
    recommendation: 'N/A in EDLP format. Focus investment on listing fees and innovation slots rather than promotional calendars.',
    impact: 'Protects distribution breadth in largest Spanish retailer',
  },
  {
    retailerId: 'mercadona',
    area: 'Seasonality',
    recommendation: 'Use seasonal innovation launches (summer limited editions, winter immunity) to create news in the absence of price promotions.',
    impact: 'Drives incremental trial through novelty rather than price',
  },
  {
    retailerId: 'mercadona',
    area: 'Visibility',
    recommendation: 'In Mercadona, shelf position is the primary visibility lever. Invest in category captaincy conversations to secure optimal placement.',
    impact: 'Better shelf positioning can deliver 10-15% sales uplift',
  },
]
