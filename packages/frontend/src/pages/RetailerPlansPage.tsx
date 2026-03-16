import { useState } from 'react'
import {
  retailers,
  brands,
  pricingByRetailer,
  assortmentRecommendations,
  assortmentTotals,
  promoRecommendations,
  promoCalendar,
} from '../data/danone'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { SectionHeader } from '../components/ui/SectionHeader'
import { cn } from '../utils/cn'
import type { RetailerGroupId } from '../types/retailer'

// ── Tab config with retailer accent colors ───────────────────────────────────
const retailerTabs: { groupId: RetailerGroupId; label: string; color: string; borderColor: string; bgColor: string }[] = [
  { groupId: 'carrefour', label: 'Carrefour', color: 'text-blue-400', borderColor: 'border-blue-500', bgColor: 'bg-blue-500/15' },
  { groupId: 'ahorramas', label: 'Ahorramas', color: 'text-red-400', borderColor: 'border-red-500', bgColor: 'bg-red-500/15' },
  { groupId: 'mercadona', label: 'Mercadona', color: 'text-emerald-400', borderColor: 'border-emerald-500', bgColor: 'bg-emerald-500/15' },
  { groupId: 'discounters', label: 'Discounters', color: 'text-amber-400', borderColor: 'border-amber-500', bgColor: 'bg-amber-500/15' },
]

// ── Helper: brand display name lookup ────────────────────────────────────────
function brandName(id: string): string {
  return brands.find(b => b.id === id)?.displayName ?? id
}

// ── Area icon mapping ────────────────────────────────────────────────────────
function AreaIcon({ area }: { area: string }) {
  switch (area) {
    case 'Price Points':
      return (
        <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
        </svg>
      )
    case 'Depth Of Deal':
      return (
        <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
        </svg>
      )
    case 'Mechanics':
      return (
        <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.212-1.281c-.063-.374-.313-.686-.645-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
      )
    case 'Frequency':
      return (
        <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      )
    case 'Seasonality':
      return (
        <svg className="w-5 h-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
        </svg>
      )
    case 'Visibility':
      return (
        <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
      )
    default:
      return null
  }
}

// ── Relationship score dots ──────────────────────────────────────────────────
function RelationshipDots({ score, max = 10 }: { score: number; max?: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          className={cn(
            'w-2 h-2 rounded-full',
            i < score ? 'bg-blue-400' : 'bg-slate-700'
          )}
        />
      ))}
    </div>
  )
}

// ── Negotiation status badge variant ─────────────────────────────────────────
function negotiationVariant(status: string): 'success' | 'warning' | 'critical' {
  if (status === 'Strong') return 'success'
  if (status === 'Neutral') return 'warning'
  return 'critical'
}

// ── Competitiveness color ────────────────────────────────────────────────────
function competitivenessColor(c: string): string {
  if (c === 'Uncompetitive') return 'text-red-400'
  if (c === 'Competitive') return 'text-emerald-400'
  return 'text-blue-400'
}

// ── Action color ─────────────────────────────────────────────────────────────
function actionColor(a: string): string {
  if (a === 'expand') return 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30'
  if (a === 'maintain') return 'text-amber-400 bg-amber-500/15 border-amber-500/30'
  return 'text-red-400 bg-red-500/15 border-red-500/30'
}

// ── Brand color for promo calendar bars ──────────────────────────────────────
const brandColors: Record<string, string> = {
  activia: 'bg-green-500',
  oikos: 'bg-blue-700',
  danone: 'bg-blue-500',
  yopro: 'bg-red-500',
  actimel: 'bg-yellow-500',
  danacol: 'bg-red-700',
  alpro: 'bg-lime-500',
  vitalinea: 'bg-sky-300',
  danonino: 'bg-orange-500',
}

// ── Main Page ────────────────────────────────────────────────────────────────

export function RetailerPlansPage() {
  const [activeTab, setActiveTab] = useState<RetailerGroupId>('carrefour')

  // Get retailer data for current tab
  const retailerGroup = retailers.filter(r => r.groupId === activeTab)
  const primaryRetailer = retailerGroup[0]

  // Filter data for selected retailer
  const pricing = pricingByRetailer.filter(p => p.retailerId === activeTab)
  const assortment = assortmentRecommendations.filter(a => a.retailerId === activeTab)
  const totals = assortmentTotals.filter(t => t.retailerId === activeTab)
  const promoRecs = promoRecommendations.filter(p => p.retailerId === activeTab)
  const calendar = promoCalendar.filter(c => c.retailerId === activeTab)

  // Aggregate SKU counts across formats
  const totalSkus = retailerGroup.reduce((sum, r) => sum + r.skuCount, 0)
  const totalFairShare = retailerGroup.reduce((sum, r) => sum + r.fairShareSkuCount, 0)
  const listingOpps = totals.reduce((sum, t) => sum + Math.max(0, t.totalListingOpps), 0)

  // Promo calendar: unique brands for this retailer
  const calendarBrands = [...new Set(calendar.map(e => e.brandId))]

  return (
    <div className="space-y-6">
      {/* ── Retailer Tabs ── */}
      <div className="flex gap-1 border-b border-slate-700/50">
        {retailerTabs.map(tab => (
          <button
            key={tab.groupId}
            onClick={() => setActiveTab(tab.groupId)}
            className={cn(
              'px-4 py-2.5 text-sm font-medium transition-all border-b-2 -mb-px',
              activeTab === tab.groupId
                ? `${tab.color} ${tab.borderColor}`
                : 'text-slate-500 border-transparent hover:text-slate-300 hover:border-slate-600'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Section 1: Retailer Overview ── */}
      {primaryRetailer && (
        <Card padding="lg">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-3 h-8 rounded-sm"
                  style={{ backgroundColor: primaryRetailer.logoColor }}
                />
                <div>
                  <h2 className="text-lg font-bold text-white">
                    {retailerGroup.map(r => r.displayName).join(' / ')}
                  </h2>
                  <p className="text-xs text-slate-400">{primaryRetailer.channelType} Channel</p>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-3">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Relationship</p>
                  <RelationshipDots score={primaryRetailer.relationshipScore} />
                </div>
                <Badge variant={negotiationVariant(primaryRetailer.negotiationStatus)}>
                  {primaryRetailer.negotiationStatus}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">SKU Count</p>
              <p className="text-2xl font-bold text-white tabular-nums">{totalSkus}</p>
              <p className="text-xs text-slate-400">
                Fair share: <span className="text-slate-300 font-medium">{totalFairShare}</span>
              </p>
              {listingOpps > 0 && (
                <p className="text-xs text-emerald-400 font-medium mt-1">+{listingOpps} listing opportunities</p>
              )}
            </div>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">Key Constraints</p>
            <ul className="space-y-1">
              {primaryRetailer.keyConstraints.map((c, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-slate-400">
                  <span className="text-slate-600 mt-0.5">--</span>
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </Card>
      )}

      {/* ── Section 2: Pricing Recommendations ── */}
      {pricing.length > 0 && (
        <section>
          <SectionHeader
            title="Pricing Recommendations"
            subtitle={`${pricing.length} brand price positions at ${retailerTabs.find(t => t.groupId === activeTab)?.label}`}
          />
          <Card padding="none">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700/50">
                  <th className="text-left text-[10px] font-medium text-slate-400 uppercase tracking-wider px-4 py-2.5">Brand</th>
                  <th className="text-right text-[10px] font-medium text-slate-400 uppercase tracking-wider px-4 py-2.5">Current Index</th>
                  <th className="text-right text-[10px] font-medium text-slate-400 uppercase tracking-wider px-4 py-2.5">Recommended</th>
                  <th className="text-center text-[10px] font-medium text-slate-400 uppercase tracking-wider px-4 py-2.5">Competitiveness</th>
                  <th className="text-left text-[10px] font-medium text-slate-400 uppercase tracking-wider px-4 py-2.5">Rationale</th>
                </tr>
              </thead>
              <tbody>
                {pricing.map(p => {
                  const delta = p.recommendedIndex - p.currentIndex
                  return (
                    <tr key={`${p.brandId}-${p.retailerId}`} className="border-b border-slate-800/50 last:border-b-0">
                      <td className="px-4 py-2.5">
                        <span className="text-sm font-medium text-slate-200">{brandName(p.brandId)}</span>
                      </td>
                      <td className="text-right px-4 py-2.5 text-sm tabular-nums text-slate-300">{p.currentIndex}</td>
                      <td className="text-right px-4 py-2.5">
                        <span className="text-sm tabular-nums text-white font-medium">{p.recommendedIndex}</span>
                        {delta !== 0 && (
                          <span className={cn('ml-1.5 text-xs tabular-nums', delta > 0 ? 'text-emerald-400' : 'text-red-400')}>
                            {delta > 0 ? '+' : ''}{delta}
                          </span>
                        )}
                      </td>
                      <td className="text-center px-4 py-2.5">
                        <span className={cn('text-xs font-medium', competitivenessColor(p.competitiveness))}>
                          {p.competitiveness}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-xs text-slate-400 max-w-xs">{p.rationale}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </Card>
        </section>
      )}

      {/* ── Section 3: Assortment Plan ── */}
      {assortment.length > 0 && (
        <section>
          <SectionHeader
            title="Assortment Plan"
            subtitle={`Segment-level SKU optimization for ${retailerTabs.find(t => t.groupId === activeTab)?.label}`}
          />
          {/* Grand totals row */}
          {totals.length > 0 && (
            <div className="flex gap-3 mb-3">
              {totals.map(t => (
                <div key={t.retailerFormat} className="flex items-center gap-3 bg-slate-800/50 rounded-lg px-3 py-2 border border-slate-700/50">
                  <span className="text-xs font-medium text-slate-300">{t.retailerFormat}</span>
                  <span className="text-xs tabular-nums text-slate-400">
                    {t.actualTotal} SKUs / {t.fairShareTotal} fair share
                  </span>
                  <span className={cn(
                    'text-xs font-medium tabular-nums',
                    t.totalListingOpps > 0 ? 'text-emerald-400' : t.totalListingOpps < 0 ? 'text-red-400' : 'text-slate-400'
                  )}>
                    {t.totalListingOpps > 0 ? '+' : ''}{t.totalListingOpps} opps
                  </span>
                </div>
              ))}
            </div>
          )}
          <Card padding="none">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700/50">
                  <th className="text-left text-[10px] font-medium text-slate-400 uppercase tracking-wider px-4 py-2.5">Segment</th>
                  {totals.length > 1 && (
                    <th className="text-left text-[10px] font-medium text-slate-400 uppercase tracking-wider px-4 py-2.5">Format</th>
                  )}
                  <th className="text-right text-[10px] font-medium text-slate-400 uppercase tracking-wider px-4 py-2.5">Actual SKUs</th>
                  <th className="text-right text-[10px] font-medium text-slate-400 uppercase tracking-wider px-4 py-2.5">Fair Share</th>
                  <th className="text-right text-[10px] font-medium text-slate-400 uppercase tracking-wider px-4 py-2.5">Listing Opps</th>
                  <th className="text-right text-[10px] font-medium text-slate-400 uppercase tracking-wider px-4 py-2.5">New Listings</th>
                  <th className="text-center text-[10px] font-medium text-slate-400 uppercase tracking-wider px-4 py-2.5">Action</th>
                </tr>
              </thead>
              <tbody>
                {assortment.map((a, i) => (
                  <tr key={i} className="border-b border-slate-800/50 last:border-b-0">
                    <td className="px-4 py-2.5 text-sm font-medium text-slate-200 capitalize">{a.segmentId.replace('-', ' ')}</td>
                    {totals.length > 1 && (
                      <td className="px-4 py-2.5 text-xs text-slate-400">{a.retailerFormat}</td>
                    )}
                    <td className="text-right px-4 py-2.5 text-sm tabular-nums text-slate-300">{a.actualSkuCount}</td>
                    <td className="text-right px-4 py-2.5 text-sm tabular-nums text-slate-400">{a.fairShareSkuCount}</td>
                    <td className={cn(
                      'text-right px-4 py-2.5 text-sm tabular-nums font-medium',
                      a.listingOpps > 0 ? 'text-emerald-400' : a.listingOpps < 0 ? 'text-red-400' : 'text-slate-400'
                    )}>
                      {a.listingOpps > 0 ? '+' : ''}{a.listingOpps}
                    </td>
                    <td className="text-right px-4 py-2.5 text-sm tabular-nums text-slate-300">{a.newListings}</td>
                    <td className="text-center px-4 py-2.5">
                      <span className={cn('inline-flex px-2 py-0.5 rounded-full text-xs font-medium border capitalize', actionColor(a.action))}>
                        {a.action}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </section>
      )}

      {/* ── Section 4: Promotion Strategy ── */}
      {promoRecs.length > 0 && (
        <section>
          <SectionHeader
            title="Promotion Strategy"
            subtitle={`${promoRecs.length} recommendations for ${retailerTabs.find(t => t.groupId === activeTab)?.label}`}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {promoRecs.map((rec, i) => (
              <Card key={i} padding="md">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 mt-0.5">
                    <AreaIcon area={rec.area} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-200 mb-1">{rec.area}</p>
                    <p className="text-xs text-slate-400 leading-relaxed mb-2">{rec.recommendation}</p>
                    <div className="flex items-center gap-1.5 bg-slate-800/50 rounded px-2 py-1 border border-slate-700/40">
                      <svg className="w-3 h-3 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22" />
                      </svg>
                      <p className="text-[10px] text-emerald-400">{rec.impact}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* ── Section 5: Promo Calendar ── */}
      {calendar.length > 0 && (
        <section>
          <SectionHeader
            title="Promo Calendar"
            subtitle={`${calendar.length} events planned for ${retailerTabs.find(t => t.groupId === activeTab)?.label}`}
            action={
              <div className="flex items-center gap-3 text-[10px]">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-2 rounded-sm bg-blue-500" /> Optimized
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-2 rounded-sm bg-slate-500 opacity-60" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)' }} /> Original
                </span>
              </div>
            }
          />
          <Card padding="none">
            <div className="overflow-x-auto">
              <div className="min-w-[900px]">
                {/* Quarter headers */}
                <div className="flex border-b border-slate-700/50">
                  <div className="w-24 shrink-0 px-3 py-1.5 text-[10px] text-slate-500 font-medium">Brand</div>
                  <div className="flex-1 flex">
                    {['Q1', 'Q2', 'Q3', 'Q4'].map(q => (
                      <div key={q} className="flex-1 text-center text-[10px] text-slate-500 font-medium py-1.5 border-l border-slate-800/50">
                        {q}
                      </div>
                    ))}
                  </div>
                </div>
                {/* Week number headers */}
                <div className="flex border-b border-slate-700/30">
                  <div className="w-24 shrink-0" />
                  <div className="flex-1 flex">
                    {Array.from({ length: 52 }).map((_, i) => (
                      <div
                        key={i}
                        className={cn(
                          'flex-1 text-center text-[7px] text-slate-600 py-0.5',
                          i % 13 === 0 && 'border-l border-slate-800/50'
                        )}
                      >
                        {(i + 1) % 4 === 1 ? i + 1 : ''}
                      </div>
                    ))}
                  </div>
                </div>
                {/* Brand rows */}
                {calendarBrands.map(bId => {
                  const brandEvents = calendar.filter(e => e.brandId === bId)
                  return (
                    <div key={bId} className="flex border-b border-slate-800/30 hover:bg-slate-800/20">
                      <div className="w-24 shrink-0 px-3 py-2 text-xs font-medium text-slate-300">{brandName(bId)}</div>
                      <div className="flex-1 relative h-8">
                        {/* Quarter dividers */}
                        {[13, 26, 39].map(w => (
                          <div
                            key={w}
                            className="absolute top-0 bottom-0 w-px bg-slate-800/50"
                            style={{ left: `${(w / 52) * 100}%` }}
                          />
                        ))}
                        {/* Event bars */}
                        {brandEvents.map(evt => {
                          const left = ((evt.startWeek - 1) / 52) * 100
                          const width = ((evt.endWeek - evt.startWeek + 1) / 52) * 100
                          const bgClass = brandColors[evt.brandId] ?? 'bg-slate-500'
                          return (
                            <div
                              key={evt.id}
                              className={cn(
                                'absolute top-1 h-6 rounded-sm flex items-center justify-center',
                                evt.isOptimized ? bgClass : 'bg-slate-600',
                                !evt.isOptimized && 'opacity-70'
                              )}
                              style={{
                                left: `${left}%`,
                                width: `${Math.max(width, 1.5)}%`,
                                ...(evt.isOptimized ? {} : {
                                  backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0,0,0,0.25) 2px, rgba(0,0,0,0.25) 4px)',
                                }),
                              }}
                              title={`${brandName(evt.brandId)} - ${evt.mechanicLabel} (W${evt.startWeek}-${evt.endWeek}) ${evt.isOptimized ? '[Optimized]' : '[Original]'}`}
                            >
                              <span className="text-[7px] text-white font-medium truncate px-0.5">{evt.mechanicLabel}</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </Card>
        </section>
      )}

      {/* ── Section 6: Trade Narrative ── */}
      <section>
        <SectionHeader title="Trade Narrative" />
        <Card padding="lg" className="border-slate-700/30">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-medium text-slate-300 mb-1">Trade Narrative</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                The AI-generated trade narrative for{' '}
                <span className="text-slate-400 font-medium">{retailerTabs.find(t => t.groupId === activeTab)?.label}</span>{' '}
                will appear here when generated by the RGM Expert Agent. Navigate to the Scenario Engine to generate a retailer-specific sell-in story.
              </p>
            </div>
          </div>
        </Card>
      </section>
    </div>
  )
}
