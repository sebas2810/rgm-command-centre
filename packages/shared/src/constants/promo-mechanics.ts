// Average volume uplift by promo mechanic (percentage)
export const mechanicUplift: Record<string, number> = {
  '2nd-50pct': 60,
  bogof: 120,
  'tpr-10-20': 30,
  'tpr-25-35': 15,
  'tpr-40plus': 10,
  'multi-buy': 80,
  loyalty: 25,
  sampling: 40,
}

// Promo ROI efficiency by mechanic (percentage, 100 = break-even)
export const mechanicEfficiency: Record<string, number> = {
  '2nd-50pct': 200,
  bogof: 150,
  'tpr-10-20': 40,
  'tpr-25-35': 25,
  'tpr-40plus': -10,
  'multi-buy': 180,
  loyalty: 90,
  sampling: 60,
}
