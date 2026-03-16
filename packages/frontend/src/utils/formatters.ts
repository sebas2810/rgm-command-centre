export function formatCurrency(value: number, currency: string = 'EUR', compact: boolean = false): string {
  if (compact && Math.abs(value) >= 1_000_000) {
    return `${getCurrencySymbol(currency)}${(value / 1_000_000).toFixed(1)}M`
  }
  if (compact && Math.abs(value) >= 1_000) {
    return `${getCurrencySymbol(currency)}${(value / 1_000).toFixed(0)}K`
  }
  return new Intl.NumberFormat('en-EU', {
    style: 'currency',
    currency: currency === 'PLN' ? 'PLN' : currency === 'GBP' ? 'GBP' : 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value)
}

export function getCurrencySymbol(currency: string): string {
  switch (currency) {
    case 'GBP': return '£'
    case 'PLN': return 'zł'
    default: return '€'
  }
}

export function formatPct(value: number, decimals: number = 1): string {
  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toFixed(decimals)}%`
}

export function formatPp(value: number, decimals: number = 1): string {
  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toFixed(decimals)}pp`
}

export function formatNumber(value: number, decimals: number = 1): string {
  return value.toFixed(decimals)
}

export function formatCompactNumber(value: number): string {
  if (Math.abs(value) >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (Math.abs(value) >= 1_000) return `${(value / 1_000).toFixed(0)}K`
  return value.toFixed(0)
}

export function formatMillions(value: number, prefix: string = '€'): string {
  return `${prefix}${value.toFixed(1)}M`
}

export function formatWeeks(value: string): string {
  return `${value} weeks`
}
