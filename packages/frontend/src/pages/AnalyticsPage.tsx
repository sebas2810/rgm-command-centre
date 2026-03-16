import { useState } from 'react'
import {
  attributeImportance,
  brandRevenueIndex,
  priceLeadership,
  currentPackPrices,
  idealPackPrices,
  skuShareValue,
  assortmentTotals,
  assortmentRecommendations,
  promoEfficiency,
  promoMechanicStats,
  promoRecommendations,
  pricingByRetailer,
  crossElasticityCarrefour,
  crossElasticityMercadona,
} from '../data/danone'
import type { CrossElasticityEntry } from '../types/pricing'

// ─── Constants ────────────────────────────────────────────────────────────────

const TABS = [
  'Consumer Pricing',
  'Pack Architecture',
  'Promotions',
  'Competitive Landscape',
  'Cross-Elasticity',
] as const

type TabName = (typeof TABS)[number]

const AREA_ICONS: Record<string, string> = {
  'Price Points': '\u{1F3AF}',
  'Depth Of Deal': '\u{1F4C9}',
  Mechanics: '\u{2699}\u{FE0F}',
  Frequency: '\u{1F4C5}',
  Seasonality: '\u{2600}\u{FE0F}',
  Visibility: '\u{1F441}\u{FE0F}',
}

// ─── Shared UI Helpers ────────────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">{children}</h3>
}

function Panel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-slate-700/50 bg-slate-900/50 p-5 ${className}`}>
      {children}
    </div>
  )
}

// ─── Tab 1: Consumer Pricing ──────────────────────────────────────────────────

function ConsumerPricingTab() {
  const maxImportance = Math.max(...attributeImportance.map((a) => a.importancePct))
  const maxRevIdx = Math.max(...brandRevenueIndex.map((b) => b.revenueIndex))

  return (
    <div className="space-y-8">
      {/* Attribute Importance */}
      <Panel>
        <SectionTitle>Attribute Importance in Yogurt Purchase Decision</SectionTitle>
        <div className="space-y-2">
          {attributeImportance.map((a, i) => (
            <div key={a.attribute} className="flex items-center gap-3">
              <span className="w-5 text-right text-xs text-slate-500">{i + 1}</span>
              <span className="w-28 shrink-0 text-sm text-slate-200">{a.attribute}</span>
              <div className="flex-1">
                <div className="relative h-6 rounded bg-slate-800">
                  <div
                    className="h-full rounded bg-gradient-to-r from-teal-600 to-teal-400"
                    style={{ width: `${(a.importancePct / maxImportance) * 100}%` }}
                  />
                </div>
              </div>
              <span className="w-14 text-right text-sm font-medium text-teal-300">
                {a.importancePct}%
              </span>
              <span className="hidden w-64 text-xs text-slate-500 lg:block">{a.insight}</span>
            </div>
          ))}
        </div>
      </Panel>

      {/* Brand Revenue Index */}
      <Panel>
        <SectionTitle>Brand Revenue Index (100 = baseline)</SectionTitle>
        <div className="space-y-1.5">
          {brandRevenueIndex.map((b) => (
            <div key={b.brandId} className="flex items-center gap-3">
              <span className="w-44 shrink-0 text-sm text-slate-200">
                {b.brandName}
                {b.isPrivateLabel && (
                  <span className="ml-2 rounded bg-amber-900/40 px-1.5 py-0.5 text-[10px] text-amber-400">
                    PL
                  </span>
                )}
              </span>
              <div className="relative flex-1">
                {/* Baseline marker at 100 */}
                <div
                  className="absolute top-0 h-full w-px bg-slate-500/60"
                  style={{ left: `${(100 / maxRevIdx) * 100}%` }}
                />
                <div className="h-5 rounded bg-slate-800">
                  <div
                    className={`h-full rounded ${b.isPrivateLabel ? 'bg-amber-600/70' : 'bg-teal-600/70'}`}
                    style={{ width: `${(b.revenueIndex / maxRevIdx) * 100}%` }}
                  />
                </div>
              </div>
              <span className="w-10 text-right text-sm font-medium text-slate-300">
                {b.revenueIndex}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <span className="inline-block h-2.5 w-2.5 rounded bg-teal-600/70" /> Branded
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2.5 w-2.5 rounded bg-amber-600/70" /> Private Label
          </span>
          <span>| dashed line = 100 baseline</span>
        </div>
      </Panel>

      {/* Price Leadership Matrix */}
      <Panel>
        <SectionTitle>Price Leadership Matrix</SectionTitle>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700 text-left text-xs uppercase text-slate-500">
                <th className="pb-2 pr-3">Brand / Segment</th>
                <th className="pb-2 pr-3">Price Pos.</th>
                <th className="pb-2 pr-3">Corridor</th>
                <th className="pb-2 pr-3">Leadership</th>
                <th className="pb-2 pr-3">Segment Lead</th>
                <th className="pb-2 pr-3">Pricing Power</th>
                <th className="pb-2 pr-2 text-center">Low Elast.</th>
                <th className="pb-2 pr-3">Killer Prices</th>
                <th className="pb-2 text-right">Margin</th>
              </tr>
            </thead>
            <tbody>
              {priceLeadership.map((row) => {
                const score = row.criteriaMetCount / row.totalCriteria
                const scoreColor =
                  score >= 0.7 ? 'text-emerald-400' : score >= 0.4 ? 'text-amber-400' : 'text-red-400'
                return (
                  <tr key={`${row.brandId}-${row.segment}`} className="border-b border-slate-800">
                    <td className="py-2 pr-3">
                      <span className="font-medium text-slate-200 capitalize">{row.brandId}</span>
                      <span className="ml-1 text-xs text-slate-500">({row.segment})</span>
                    </td>
                    <td className="py-2 pr-3">
                      <span
                        className={`rounded px-1.5 py-0.5 text-xs ${
                          row.pricePosition === 'Premium'
                            ? 'bg-purple-900/40 text-purple-300'
                            : row.pricePosition === 'Mid-Tier'
                              ? 'bg-blue-900/40 text-blue-300'
                              : 'bg-slate-700/40 text-slate-300'
                        }`}
                      >
                        {row.pricePosition}
                      </span>
                    </td>
                    <td className="py-2 pr-3 text-xs text-slate-400">{row.priceCorridor}</td>
                    <td className="py-2 pr-3">
                      <span
                        className={`text-xs ${row.priceLeadership === 'Leader' ? 'text-emerald-400' : 'text-slate-400'}`}
                      >
                        {row.priceLeadership}
                      </span>
                    </td>
                    <td className="max-w-[180px] truncate py-2 pr-3 text-xs text-slate-400">
                      {row.segmentLeadership}
                    </td>
                    <td className="max-w-[160px] truncate py-2 pr-3 text-xs text-slate-400">
                      {row.pricingPower}
                    </td>
                    <td className="py-2 pr-2 text-center">
                      {row.lowElasticity ? (
                        <span className="text-emerald-400">Yes</span>
                      ) : (
                        <span className="text-red-400">No</span>
                      )}
                    </td>
                    <td className="py-2 pr-3 text-xs text-slate-400">{row.killerPricePoints}</td>
                    <td className="py-2 text-right">
                      <span className={scoreColor}>{row.marginPct}%</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  )
}

// ─── Tab 2: Pack Architecture ─────────────────────────────────────────────────

function PackArchitectureTab() {
  const maxPricePerKg = Math.max(
    ...currentPackPrices.map((p) => p.pricePerKgEur),
    ...idealPackPrices.map((p) => p.pricePerKgEur)
  )

  const channels = ['Carrefour Hyper', 'Mercadona', 'Ahorramas', 'Discounters']
  const segments = [...new Set(skuShareValue.map((s) => s.segmentId))]
  const filteredSKU = skuShareValue.filter((s) => channels.includes(s.channelOrRetailer))

  return (
    <div className="space-y-8">
      {/* Current vs Ideal Pack Prices */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Current */}
        <Panel>
          <SectionTitle>Current Pack Prices (4-ct)</SectionTitle>
          <div className="space-y-2">
            {currentPackPrices.map((p) => (
              <div key={`${p.brandId}-${p.subline}`} className="flex items-center gap-2">
                <span className="w-44 shrink-0 truncate text-sm text-slate-200">{p.subline}</span>
                <span className="w-14 text-right text-xs text-slate-400">{p.unitSizeG}g</span>
                <div className="flex-1">
                  <div className="h-4 rounded bg-slate-800">
                    <div
                      className="h-full rounded bg-blue-600/60"
                      style={{ width: `${(p.pricePerKgEur / maxPricePerKg) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="w-20 text-right text-xs text-slate-300">
                  {p.pricePerKgEur.toFixed(2)} /kg
                </span>
              </div>
            ))}
          </div>
        </Panel>

        {/* Ideal */}
        <Panel>
          <SectionTitle>Ideal Pack Architecture</SectionTitle>
          <div className="space-y-2">
            {idealPackPrices.map((p) => (
              <div key={`${p.brandId}-${p.subline}`}>
                <div className="flex items-center gap-2">
                  <span className="w-44 shrink-0 truncate text-sm text-slate-200">{p.subline}</span>
                  <span className="w-14 text-right text-xs text-slate-400">{p.unitSizeG}g</span>
                  <div className="flex-1">
                    <div className="h-4 rounded bg-slate-800">
                      <div
                        className="h-full rounded bg-teal-500/60"
                        style={{ width: `${(p.pricePerKgEur / maxPricePerKg) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="w-20 text-right text-xs text-teal-300">
                    {p.pricePerKgEur.toFixed(2)} /kg
                  </span>
                </div>
                {p.recommendation && (
                  <p className="ml-[15.5rem] mt-0.5 text-[11px] leading-tight text-teal-500/80">
                    {p.recommendation}
                  </p>
                )}
              </div>
            ))}
          </div>
        </Panel>
      </div>

      {/* SKU Share vs Value Share Grid */}
      <Panel>
        <SectionTitle>SKU Share vs Value Share Ratio (key channels)</SectionTitle>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700 text-left text-xs uppercase text-slate-500">
                <th className="pb-2 pr-3">Segment</th>
                {channels.map((ch) => (
                  <th key={ch} className="pb-2 pr-3 text-center">
                    {ch}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {segments.map((seg) => (
                <tr key={seg} className="border-b border-slate-800">
                  <td className="py-2 pr-3 text-sm capitalize text-slate-200">{seg.replace('-', ' ')}</td>
                  {channels.map((ch) => {
                    const entry = filteredSKU.find(
                      (s) => s.segmentId === seg && s.channelOrRetailer === ch
                    )
                    if (!entry) return <td key={ch} className="py-2 pr-3 text-center text-slate-600">-</td>
                    const r = entry.ratio
                    const bg =
                      r >= 90 && r <= 110
                        ? 'bg-emerald-900/30 text-emerald-400'
                        : r < 80 || r > 130
                          ? 'bg-red-900/30 text-red-400'
                          : 'bg-amber-900/30 text-amber-400'
                    return (
                      <td key={ch} className="py-2 pr-3 text-center">
                        <span className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${bg}`}>
                          {r}
                        </span>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 flex gap-4 text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded bg-emerald-600" /> 90-110: Balanced
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded bg-amber-600" /> 80-130: Moderate
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded bg-red-600" /> &lt;80 / &gt;130: Misaligned
          </span>
        </div>
      </Panel>

      {/* Assortment */}
      <Panel>
        <SectionTitle>Assortment Totals by Retailer</SectionTitle>
        <div className="mb-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700 text-left text-xs uppercase text-slate-500">
                <th className="pb-2 pr-3">Retailer Format</th>
                <th className="pb-2 pr-3 text-right">Actual SKUs</th>
                <th className="pb-2 pr-3 text-right">Fair Share</th>
                <th className="pb-2 pr-3 text-right">Listing Opps</th>
                <th className="pb-2 text-right">New Listings</th>
              </tr>
            </thead>
            <tbody>
              {assortmentTotals.map((t) => (
                <tr key={t.retailerFormat} className="border-b border-slate-800">
                  <td className="py-2 pr-3 text-slate-200">{t.retailerFormat}</td>
                  <td className="py-2 pr-3 text-right text-slate-300">{t.actualTotal}</td>
                  <td className="py-2 pr-3 text-right text-slate-300">{t.fairShareTotal}</td>
                  <td className="py-2 pr-3 text-right">
                    <span className={t.totalListingOpps > 0 ? 'text-emerald-400' : 'text-red-400'}>
                      {t.totalListingOpps > 0 ? '+' : ''}
                      {t.totalListingOpps}
                    </span>
                  </td>
                  <td className="py-2 text-right text-teal-400">{t.totalNewListings}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <SectionTitle>Assortment Recommendations by Retailer &amp; Segment</SectionTitle>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700 text-left text-xs uppercase text-slate-500">
                <th className="pb-2 pr-3">Retailer</th>
                <th className="pb-2 pr-3">Segment</th>
                <th className="pb-2 pr-3 text-right">Actual</th>
                <th className="pb-2 pr-3 text-right">Fair Share</th>
                <th className="pb-2 pr-3 text-right">Opps</th>
                <th className="pb-2 pr-3 text-right">New</th>
                <th className="pb-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {assortmentRecommendations.map((r, i) => (
                <tr key={i} className="border-b border-slate-800/50">
                  <td className="py-1.5 pr-3 text-xs text-slate-400">{r.retailerFormat}</td>
                  <td className="py-1.5 pr-3 text-xs capitalize text-slate-300">
                    {r.segmentId.replace('-', ' ')}
                  </td>
                  <td className="py-1.5 pr-3 text-right text-xs text-slate-300">{r.actualSkuCount}</td>
                  <td className="py-1.5 pr-3 text-right text-xs text-slate-300">{r.fairShareSkuCount}</td>
                  <td className="py-1.5 pr-3 text-right text-xs">
                    <span className={r.listingOpps > 0 ? 'text-emerald-400' : r.listingOpps < 0 ? 'text-red-400' : 'text-slate-500'}>
                      {r.listingOpps > 0 ? '+' : ''}{r.listingOpps}
                    </span>
                  </td>
                  <td className="py-1.5 pr-3 text-right text-xs text-teal-400">{r.newListings}</td>
                  <td className="py-1.5">
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
                        r.action === 'expand'
                          ? 'bg-emerald-900/40 text-emerald-400'
                          : r.action === 'rationalize'
                            ? 'bg-red-900/40 text-red-400'
                            : 'bg-slate-700/40 text-slate-400'
                      }`}
                    >
                      {r.action}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  )
}

// ─── Tab 3: Promotions ────────────────────────────────────────────────────────

function PromotionsTab() {
  const [retailerFilter, setRetailerFilter] = useState<string>('ahorramas')
  const retailers = [...new Set(promoEfficiency.map((p) => p.retailerId))]
  const filtered = promoEfficiency.filter((p) => p.retailerId === retailerFilter)

  const sortedMechanics = [...promoMechanicStats].sort((a, b) => b.avgValueUpliftPct - a.avgValueUpliftPct)
  const mechanicMax = Math.max(...sortedMechanics.map((m) => m.q3))
  const mechanicMin = Math.min(...sortedMechanics.map((m) => m.q1))
  const mechanicRange = mechanicMax - mechanicMin

  const recRetailers = [...new Set(promoRecommendations.map((r) => r.retailerId))]

  return (
    <div className="space-y-8">
      {/* Promo Efficiency Table */}
      <Panel>
        <div className="mb-3 flex items-center justify-between">
          <SectionTitle>Promo Efficiency by Brand</SectionTitle>
          <div className="flex gap-1">
            {retailers.map((r) => (
              <button
                key={r}
                onClick={() => setRetailerFilter(r)}
                className={`rounded px-2.5 py-1 text-xs capitalize transition ${
                  retailerFilter === r
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700 text-left text-xs uppercase text-slate-500">
              <th className="pb-2 pr-3">Brand</th>
              <th className="pb-2 pr-3 text-right">Promo Sales (K)</th>
              <th className="pb-2 pr-3 text-right">VSOD%</th>
              <th className="pb-2 pr-3 text-right">Evolution</th>
              <th className="pb-2 pr-3">Value Uplift</th>
              <th className="pb-2 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.brandId} className="border-b border-slate-800">
                <td className="py-2 pr-3 capitalize text-slate-200">{p.brandId}</td>
                <td className="py-2 pr-3 text-right text-slate-300">
                  {p.promoValueSalesK.toLocaleString()}
                </td>
                <td className="py-2 pr-3 text-right text-slate-300">{p.vsodPct}%</td>
                <td className="py-2 pr-3 text-right">
                  <span className={p.vsodEvolutionPct >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                    {p.vsodEvolutionPct >= 0 ? '\u25B2' : '\u25BC'} {Math.abs(p.vsodEvolutionPct)}%
                  </span>
                </td>
                <td className="py-2 pr-3">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-24 rounded bg-slate-800">
                      {p.valueUpliftPct >= 0 ? (
                        <div
                          className="h-full rounded bg-emerald-500/60"
                          style={{ width: `${Math.min(Math.abs(p.valueUpliftPct), 150) / 1.5}%` }}
                        />
                      ) : (
                        <div className="flex h-full justify-end">
                          <div
                            className="h-full rounded bg-red-500/60"
                            style={{ width: `${Math.min(Math.abs(p.valueUpliftPct), 150) / 1.5}%` }}
                          />
                        </div>
                      )}
                    </div>
                    <span
                      className={`text-xs ${p.valueUpliftPct >= 0 ? 'text-emerald-400' : 'text-red-400'}`}
                    >
                      {p.valueUpliftPct > 0 ? '+' : ''}
                      {p.valueUpliftPct}%
                    </span>
                  </div>
                </td>
                <td className="py-2 text-center">
                  <span
                    className={`inline-block h-2.5 w-2.5 rounded-full ${p.isEfficient ? 'bg-emerald-400' : 'bg-red-400'}`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      {/* Mechanic Comparison */}
      <Panel>
        <SectionTitle>Promo Mechanic Comparison (Value Uplift %)</SectionTitle>
        <div className="space-y-4">
          {sortedMechanics.map((m) => {
            const leftPct = ((m.q1 - mechanicMin) / mechanicRange) * 100
            const widthPct = ((m.q3 - m.q1) / mechanicRange) * 100
            const medianPct = ((m.medianValueUpliftPct - mechanicMin) / mechanicRange) * 100
            return (
              <div key={m.mechanic} className="flex items-center gap-3">
                <span className="w-32 shrink-0 text-sm text-slate-200">{m.label}</span>
                <div className="relative h-6 flex-1 rounded bg-slate-800">
                  {/* IQR bar */}
                  <div
                    className="absolute top-1 h-4 rounded bg-teal-600/50"
                    style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                  />
                  {/* Median marker */}
                  <div
                    className="absolute top-0 h-6 w-0.5 bg-teal-300"
                    style={{ left: `${medianPct}%` }}
                  />
                </div>
                <span className="w-24 text-right text-xs text-slate-400">
                  avg <span className="text-teal-300">{m.avgValueUpliftPct}%</span>
                </span>
                <span className="w-16 text-right text-xs text-slate-500">n={m.sampleSize}</span>
              </div>
            )
          })}
        </div>
        <div className="mt-3 flex gap-4 text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-6 rounded bg-teal-600/50" /> Q1-Q3 range
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-3 w-0.5 bg-teal-300" /> Median
          </span>
        </div>
      </Panel>

      {/* Recommendations by Retailer */}
      <Panel>
        <SectionTitle>Promo Recommendations by Retailer</SectionTitle>
        <div className="space-y-6">
          {recRetailers.map((retailer) => {
            const recs = promoRecommendations.filter((r) => r.retailerId === retailer)
            return (
              <div key={retailer}>
                <h4 className="mb-3 text-sm font-medium capitalize text-slate-200">{retailer}</h4>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {recs.map((rec, i) => (
                    <div
                      key={i}
                      className="rounded-lg border border-slate-700/40 bg-slate-800/40 p-3"
                    >
                      <div className="mb-1.5 flex items-center gap-2">
                        <span className="text-base">{AREA_ICONS[rec.area] || '\u{1F4CB}'}</span>
                        <span className="text-xs font-medium text-teal-400">{rec.area}</span>
                      </div>
                      <p className="mb-2 text-xs leading-relaxed text-slate-300">{rec.recommendation}</p>
                      <p className="text-[11px] text-slate-500">Impact: {rec.impact}</p>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </Panel>
    </div>
  )
}

// ─── Tab 4: Competitive Landscape ─────────────────────────────────────────────

function CompetitiveLandscapeTab() {
  const brands = [...new Set(pricingByRetailer.map((p) => p.brandId))]
  const retailers = [...new Set(pricingByRetailer.map((p) => p.retailerId))]

  return (
    <div className="space-y-8">
      {/* Pricing by Retailer Matrix */}
      <Panel>
        <SectionTitle>Pricing Index by Brand x Retailer (vs Private Label = 100)</SectionTitle>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700 text-left text-xs uppercase text-slate-500">
                <th className="pb-2 pr-4">Brand</th>
                {retailers.map((r) => (
                  <th key={r} className="pb-2 pr-4 text-center capitalize">
                    {r}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {brands.map((brand) => (
                <tr key={brand} className="border-b border-slate-800">
                  <td className="py-2.5 pr-4 capitalize text-slate-200">{brand}</td>
                  {retailers.map((retailer) => {
                    const entry = pricingByRetailer.find(
                      (p) => p.brandId === brand && p.retailerId === retailer
                    )
                    if (!entry)
                      return (
                        <td key={retailer} className="py-2.5 pr-4 text-center text-slate-600">
                          -
                        </td>
                      )

                    const compColor =
                      entry.competitiveness === 'Uncompetitive'
                        ? 'bg-red-900/30 border-red-700/40'
                        : entry.competitiveness === 'Over-competitive'
                          ? 'bg-blue-900/30 border-blue-700/40'
                          : 'bg-emerald-900/30 border-emerald-700/40'

                    const textColor =
                      entry.competitiveness === 'Uncompetitive'
                        ? 'text-red-400'
                        : entry.competitiveness === 'Over-competitive'
                          ? 'text-blue-400'
                          : 'text-emerald-400'

                    return (
                      <td key={retailer} className="py-2.5 pr-4 text-center">
                        <div
                          className={`inline-block rounded border px-2.5 py-1 ${compColor}`}
                          title={entry.rationale}
                        >
                          <div className={`text-sm font-medium ${textColor}`}>{entry.currentIndex}</div>
                          <div className="text-[10px] text-slate-500">rec: {entry.recommendedIndex}</div>
                        </div>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 flex gap-4 text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <span className="inline-block h-2.5 w-2.5 rounded border border-emerald-700/40 bg-emerald-900/30" />{' '}
            Competitive
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2.5 w-2.5 rounded border border-red-700/40 bg-red-900/30" />{' '}
            Uncompetitive
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2.5 w-2.5 rounded border border-blue-700/40 bg-blue-900/30" />{' '}
            Over-competitive
          </span>
        </div>
      </Panel>

      {/* Detail rationale table */}
      <Panel>
        <SectionTitle>Price Position Rationale</SectionTitle>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700 text-left text-xs uppercase text-slate-500">
                <th className="pb-2 pr-3">Brand</th>
                <th className="pb-2 pr-3">Retailer</th>
                <th className="pb-2 pr-3 text-right">Current</th>
                <th className="pb-2 pr-3 text-right">Recommended</th>
                <th className="pb-2 pr-3 text-right">Gap</th>
                <th className="pb-2">Rationale</th>
              </tr>
            </thead>
            <tbody>
              {pricingByRetailer.map((p, i) => {
                const gap = p.recommendedIndex - p.currentIndex
                return (
                  <tr key={i} className="border-b border-slate-800/50">
                    <td className="py-1.5 pr-3 capitalize text-slate-200">{p.brandId}</td>
                    <td className="py-1.5 pr-3 text-xs capitalize text-slate-400">{p.retailerId}</td>
                    <td className="py-1.5 pr-3 text-right text-slate-300">{p.currentIndex}</td>
                    <td className="py-1.5 pr-3 text-right text-teal-400">{p.recommendedIndex}</td>
                    <td className="py-1.5 pr-3 text-right">
                      <span
                        className={
                          gap > 0 ? 'text-emerald-400' : gap < 0 ? 'text-red-400' : 'text-slate-500'
                        }
                      >
                        {gap > 0 ? '+' : ''}
                        {gap}
                      </span>
                    </td>
                    <td className="max-w-xs truncate py-1.5 text-xs text-slate-500">{p.rationale}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  )
}

// ─── Tab 5: Cross-Elasticity ──────────────────────────────────────────────────

function ElasticityQuadrant({
  title,
  data,
}: {
  title: string
  data: CrossElasticityEntry[]
}) {
  // Axes: X = priceDownAppeal (negative, more negative = more appeal = right side)
  // Y = priceUpRetention (negative, more negative = worse retention = top)

  const xMin = Math.min(...data.map((d) => d.priceDownAppeal))
  const xMax = Math.max(...data.map((d) => d.priceDownAppeal))
  const yMin = Math.min(...data.map((d) => d.priceUpRetention))
  const yMax = Math.max(...data.map((d) => d.priceUpRetention))

  const padding = 0.2
  const xRange = xMax - xMin + padding * 2
  const yRange = yMax - yMin + padding * 2

  // Map data point to % position in the chart
  // X: more negative priceDownAppeal = more appeal = right
  const toX = (val: number) => ((val - (xMin - padding)) / xRange) * 100
  // Y: more negative priceUpRetention = worse retention = top
  const toY = (val: number) => (1 - (val - (yMin - padding)) / yRange) * 100

  // Center lines (at the average)
  const xMid = (xMin + xMax) / 2
  const yMid = (yMin + yMax) / 2

  return (
    <Panel>
      <SectionTitle>{title}</SectionTitle>
      <div className="relative mx-auto" style={{ height: 380, maxWidth: 600 }}>
        {/* Quadrant background colors */}
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 overflow-hidden rounded-lg">
          {/* Top-left: low retention & low appeal (worst) */}
          <div className="bg-red-950/20" />
          {/* Top-right: low retention & high appeal */}
          <div className="bg-amber-950/15" />
          {/* Bottom-left: high retention & low appeal */}
          <div className="bg-amber-950/15" />
          {/* Bottom-right: high retention & high appeal (best) */}
          <div className="bg-emerald-950/20" />
        </div>

        {/* Center crosshair lines */}
        <div
          className="absolute top-0 h-full w-px bg-slate-600/50"
          style={{ left: `${toX(xMid)}%` }}
        />
        <div
          className="absolute left-0 h-px w-full bg-slate-600/50"
          style={{ top: `${toY(yMid)}%` }}
        />

        {/* Quadrant labels */}
        <span className="absolute left-2 top-2 text-[10px] text-red-400/70">
          Low retention &amp; low appeal
        </span>
        <span className="absolute right-2 top-2 text-right text-[10px] text-amber-400/70">
          Low retention &amp; high appeal
        </span>
        <span className="absolute bottom-2 left-2 text-[10px] text-amber-400/70">
          High retention &amp; low appeal
        </span>
        <span className="absolute bottom-2 right-2 text-right text-[10px] text-emerald-400/70">
          High retention &amp; high appeal
        </span>

        {/* Data points */}
        {data.map((d) => {
          const x = toX(d.priceDownAppeal)
          const y = toY(d.priceUpRetention)
          const dotColor =
            d.quadrant === 'high-ret-high-appeal'
              ? 'bg-emerald-400'
              : d.quadrant === 'low-ret-low-appeal'
                ? 'bg-red-400'
                : 'bg-amber-400'
          return (
            <div
              key={d.brandId}
              className="absolute"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div className={`h-3 w-3 rounded-full ${dotColor} ring-2 ring-slate-900`} />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 whitespace-nowrap text-[11px] font-medium text-slate-300 capitalize">
                {String(d.brandId).replace('-', ' ')}
              </span>
            </div>
          )
        })}

        {/* Axis labels */}
        <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[11px] text-slate-500">
          Price Down Appeal (more negative = more appeal) &rarr;
        </div>
        <div
          className="absolute -left-6 top-1/2 origin-center -translate-y-1/2 -rotate-90 whitespace-nowrap text-[11px] text-slate-500"
        >
          &larr; Price Up Retention (more negative = worse retention)
        </div>
      </div>
    </Panel>
  )
}

function CrossElasticityTab() {
  return (
    <div className="space-y-8">
      <ElasticityQuadrant title="Cross-Elasticity: Carrefour" data={crossElasticityCarrefour} />
      <ElasticityQuadrant title="Cross-Elasticity: Mercadona" data={crossElasticityMercadona} />
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<TabName>('Consumer Pricing')

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {/* Header */}
      <div className="border-b border-slate-700/50 bg-slate-800/50 px-6 py-4">
        <h1 className="text-xl font-semibold text-slate-100">Deep-Dive Analytics</h1>
        <p className="mt-1 text-sm text-slate-400">Danone Spain Yogurt &mdash; Consumer, Pack, Promo, Competitive &amp; Elasticity Analysis</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-slate-700/30 bg-slate-800/30 px-6 py-3">
        <div className="flex flex-wrap gap-2">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                activeTab === tab
                  ? 'bg-teal-600 text-white shadow-lg shadow-teal-900/30'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'Consumer Pricing' && <ConsumerPricingTab />}
        {activeTab === 'Pack Architecture' && <PackArchitectureTab />}
        {activeTab === 'Promotions' && <PromotionsTab />}
        {activeTab === 'Competitive Landscape' && <CompetitiveLandscapeTab />}
        {activeTab === 'Cross-Elasticity' && <CrossElasticityTab />}
      </div>
    </div>
  )
}
