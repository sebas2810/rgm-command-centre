import type { AttributeImportance } from '../../types/pricing'

export const attributeImportance: AttributeImportance[] = [
  {
    attribute: 'Price',
    importancePct: 32.1,
    insight: 'Most important below 2\u20AC; stronger than Brand on pricing power',
  },
  {
    attribute: 'Brand',
    importancePct: 25.7,
    insight: 'Danone and Hacendado stand out; Oikos, Activia, Actimel follow',
  },
  {
    attribute: 'Promo',
    importancePct: 17.1,
    insight: 'Ranked 2nd-3rd on purchasing decision',
  },
  {
    attribute: 'Type',
    importancePct: 6.7,
    insight: 'Yogurt type matters for segment switching',
  },
  {
    attribute: 'Size',
    importancePct: 6.1,
    insight: 'Pack size lower than expected',
  },
  {
    attribute: 'Flavours',
    importancePct: 2.9,
    insight: 'Bicompartimentos and chocolate chips drive preference',
  },
  {
    attribute: 'RTB',
    importancePct: 2.2,
    insight: 'Recommended by nutritionists',
  },
  {
    attribute: 'Fat & Sugar',
    importancePct: 2.2,
    insight: '0% positioning',
  },
  {
    attribute: 'RW',
    importancePct: 2.0,
    insight: 'Extra calcium / oveja',
  },
  {
    attribute: "Milk's Origin",
    importancePct: 1.8,
    insight: 'Vaca sin lactosa',
  },
  {
    attribute: 'Benefits',
    importancePct: 1.2,
    insight: 'Low differentiation; commoditization indicator',
  },
]
