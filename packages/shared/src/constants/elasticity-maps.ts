// Brand self-elasticity coefficients (simplified model)
// Negative = price-sensitive (price up → volume down)
export const brandElasticityMap: Record<string, number> = {
  activia: -1.8,
  oikos: -1.5,
  griego: -1.2,
  yopro: -1.3,
  danone: -2.0,
  actimel: -0.8,
  danacol: -0.6,
  alpro: -1.1,
  vitalinea: -1.6,
  danonino: -1.4,
  proteina: -1.9,
  natillas: -2.1,
}

// Retailer price sensitivity modifiers
// >1.0 = more price sensitive, <1.0 = less
export const retailerElasticityModifiers: Record<string, number> = {
  carrefour: 1.0,
  ahorramas: 0.9,
  mercadona: 1.4, // Hacendado makes consumers more price sensitive
  discounters: 1.3,
}
