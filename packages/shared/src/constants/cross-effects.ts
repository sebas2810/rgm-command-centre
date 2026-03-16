// Cross-elasticity coefficient matrix
// crossEffects[sourceBrand][affectedBrand] = coefficient
// When sourceBrand price changes by X%, affectedBrand volume changes by X * coefficient
export const crossEffects: Record<string, Record<string, number>> = {
  activia: { oikos: 0.15, griego: 0.25, danone: 0.10, hacendado: 0.30 },
  oikos: { activia: 0.10, griego: 0.35, pastoret: 0.20, hacendado: 0.15 },
  actimel: { danacol: 0.05, hacendado: 0.20, nestle: 0.15 },
  yopro: { proteina: 0.30, hacendado: 0.25, nestle: 0.10 },
}
