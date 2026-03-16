import { useState, useRef, useEffect } from 'react'
import { deviations, annualPlan, planActuals, segments, retailers } from '../data/danone'
import type { Deviation, DeviationSeverity } from '../types/plan'
import type { SegmentId } from '../types/segment'
import type { RetailerGroupId } from '../types/retailer'
import { Card } from '../components/ui/Card'
import { cn } from '../utils/cn'

// ── Helpers ──────────────────────────────────────────────────────────────

const segmentLabel = (id: SegmentId): string =>
  segments.find(s => s.id === id)?.name ?? id

const retailerLabel = (id?: RetailerGroupId): string => {
  if (!id) return 'All Retailers'
  const r = retailers.find(r => r.groupId === id)
  return r?.displayName ?? id
}

const severityOrder: Record<DeviationSeverity, number> = {
  critical: 0,
  warning: 1,
  minor: 2,
  none: 3,
}

const severityDot: Record<DeviationSeverity, string> = {
  critical: 'bg-red-500',
  warning: 'bg-amber-500',
  minor: 'bg-blue-400',
  none: 'bg-emerald-400',
}

const severityLabel: Record<DeviationSeverity, string> = {
  critical: 'Critical',
  warning: 'Warning',
  minor: 'Minor',
  none: 'Positive',
}

const rootCauseColor = (rc: string) =>
  rc.startsWith('internal') ? 'bg-orange-500/20 text-orange-300' : 'bg-purple-500/20 text-purple-300'

const rootCauseLabel = (rc: string) =>
  rc.startsWith('internal') ? 'Internal' : 'External'

const trendingIcon = (t: 'improving' | 'stable' | 'worsening') => {
  if (t === 'improving') return <span className="text-emerald-400 text-lg leading-none">&#8593;</span>
  if (t === 'worsening') return <span className="text-red-400 text-lg leading-none">&#8595;</span>
  return <span className="text-slate-400 text-lg leading-none">&#8212;</span>
}

const sortedDeviations = [...deviations].sort(
  (a, b) => severityOrder[a.severity] - severityOrder[b.severity]
)

// ── Heatmap helpers ─────────────────────────────────────────────────────

const heatmapSegments: SegmentId[] = [
  'bifidus', 'greek', 'protein', 'essentials-kids', 'kefir',
  'immunity', 'cholesterol', 'plant-based', 'light', 'kids',
]
const heatmapRetailers: RetailerGroupId[] = ['carrefour', 'ahorramas', 'mercadona', 'discounters']

// Planned NS Ix per segment from annual plan
const plannedNsIx: Record<SegmentId, number> = {} as Record<SegmentId, number>
annualPlan.segmentTargets.forEach(t => {
  plannedNsIx[t.segmentId] = t.netSalesIx
})

function heatmapColor(actual: number, planned: number): string {
  const diff = actual - planned
  if (diff > 3) return 'bg-blue-600/60 text-blue-100'
  if (diff >= -3) return 'bg-emerald-600/50 text-emerald-100'
  if (diff >= -8) return 'bg-amber-600/50 text-amber-100'
  return 'bg-red-600/50 text-red-100'
}

// ── Agent Chat Messages ─────────────────────────────────────────────────

interface ChatMessage {
  id: number
  role: 'agent' | 'user'
  text: string
}

const initialMessages: ChatMessage[] = [
  {
    id: 1,
    role: 'agent',
    text: "I've completed the Q1 2026 plan validation for Danone Spain Yogurt category. Comparing actuals against the annual plan targets.",
  },
  {
    id: 2,
    role: 'agent',
    text: "**Deviation Summary**: I've identified **8 deviations** from plan \u2014 **1 critical**, **3 warnings**, **2 minor**, and **2 positive outperformances**.",
  },
  {
    id: 3,
    role: 'agent',
    text: 'The most urgent issue is **Bifidus share loss at Carrefour** (Volume Ix 89 vs plan 103, -14 index points). This is a critical deviation driven by Activia promotion underperformance.',
  },
  {
    id: 4,
    role: 'agent',
    text: "I recommend focusing the deep dive on Bifidus turnaround levers \u2014 specifically promotional mechanic optimization and pricing corridor alignment. Shall I analyze this further?",
  },
]

// ── Simple markdown bold renderer ───────────────────────────────────────

function renderBold(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong>
    }
    return <span key={i}>{part}</span>
  })
}

// ── Summary computations ────────────────────────────────────────────────

const criticalCount = deviations.filter(d => d.severity === 'critical').length
const warningCount = deviations.filter(d => d.severity === 'warning').length
const minorCount = deviations.filter(d => d.severity === 'minor').length
const positiveCount = deviations.filter(d => d.severity === 'none').length

const totalGapM = deviations
  .filter(d => d.gapAbsolute < 0)
  .reduce((sum, d) => sum + d.gapAbsolute, 0)

const overallHealth: 'critical' | 'warning' | 'good' =
  criticalCount > 0 ? 'critical' : warningCount >= 3 ? 'warning' : 'good'

const healthColors = {
  critical: { ring: 'border-red-500', fill: 'bg-red-500', label: 'Off Track', text: 'text-red-400' },
  warning: { ring: 'border-amber-500', fill: 'bg-amber-500', label: 'At Risk', text: 'text-amber-400' },
  good: { ring: 'border-emerald-500', fill: 'bg-emerald-500', label: 'On Track', text: 'text-emerald-400' },
}

// ── Component ───────────────────────────────────────────────────────────

export default function DeviationMonitorPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', text: input.trim() }])
    setInput('')
  }

  const health = healthColors[overallHealth]

  return (
    <div className="flex h-full gap-6 p-6">
      {/* ── Left Column: Agent Chat ──────────────────────────────────── */}
      <div className="w-[420px] shrink-0 flex flex-col">
        <Card className="flex flex-col h-full" padding="none">
          {/* Header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-700/50">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h2 className="text-sm font-semibold text-slate-100 tracking-wide">Plan Validation Agent</h2>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={cn(
                  'max-w-[95%] rounded-lg px-4 py-3 text-sm leading-relaxed',
                  msg.role === 'agent'
                    ? 'bg-slate-800 text-slate-300'
                    : 'bg-blue-600/20 text-blue-100 ml-auto'
                )}
              >
                {msg.role === 'agent' && (
                  <div className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mb-1.5">Agent</div>
                )}
                <div>{renderBold(msg.text)}</div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t border-slate-700/50">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Ask the agent..."
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
              <button
                onClick={handleSend}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </Card>
      </div>

      {/* ── Right Column: Deviation Dashboard ────────────────────────── */}
      <div className="flex-1 overflow-y-auto space-y-6">
        {/* Section 1: Summary Cards */}
        <div className="grid grid-cols-3 gap-4">
          {/* Plan Health */}
          <Card>
            <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">Plan Health</div>
            <div className="flex items-center gap-4">
              <div className={cn('w-14 h-14 rounded-full border-4 flex items-center justify-center', health.ring)}>
                <div className={cn('w-8 h-8 rounded-full', health.fill)} />
              </div>
              <div>
                <div className={cn('text-xl font-bold', health.text)}>{health.label}</div>
                <div className="text-xs text-slate-400 mt-0.5">Q1 2026 Yogurt Spain</div>
              </div>
            </div>
          </Card>

          {/* Deviations */}
          <Card>
            <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">Deviations</div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-bold text-slate-100">{deviations.length}</span>
              <span className="text-sm text-slate-400">identified</span>
            </div>
            <div className="flex gap-3 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500" />{criticalCount} critical
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />{warningCount} warning
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-400" />{minorCount} minor
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />{positiveCount} positive
              </span>
            </div>
          </Card>

          {/* Financial Gap */}
          <Card>
            <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">Financial Gap</div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-bold text-red-400">{totalGapM}</span>
              <span className="text-sm text-slate-400">index points gap</span>
            </div>
            <div className="text-xs text-slate-400">
              Estimated net sales shortfall across underperforming segments
            </div>
          </Card>
        </div>

        {/* Section 2: Deviation Table */}
        <Card padding="none">
          <div className="px-5 py-4 border-b border-slate-700/50">
            <h3 className="text-sm font-semibold text-slate-100 tracking-wide">Plan vs Actual Deviations</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-slate-400 uppercase tracking-wider border-b border-slate-700/50">
                  <th className="px-5 py-3 text-left w-8"></th>
                  <th className="px-3 py-3 text-left">Segment</th>
                  <th className="px-3 py-3 text-left">Retailer</th>
                  <th className="px-3 py-3 text-left">Metric</th>
                  <th className="px-3 py-3 text-right">Planned</th>
                  <th className="px-3 py-3 text-right">Actual</th>
                  <th className="px-3 py-3 text-right">Gap</th>
                  <th className="px-3 py-3 text-center">Root Cause</th>
                  <th className="px-3 py-3 text-center">Trend</th>
                  <th className="px-3 py-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {sortedDeviations.map((d: Deviation) => (
                  <tr
                    key={d.id}
                    className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-5 py-3">
                      <div className={cn('w-2.5 h-2.5 rounded-full', severityDot[d.severity])} title={severityLabel[d.severity]} />
                    </td>
                    <td className="px-3 py-3 text-slate-200 font-medium">{segmentLabel(d.segmentId)}</td>
                    <td className="px-3 py-3 text-slate-300">{retailerLabel(d.retailerId)}</td>
                    <td className="px-3 py-3 text-slate-300">{d.metric}</td>
                    <td className="px-3 py-3 text-right text-slate-300 tabular-nums">{d.planned}</td>
                    <td className="px-3 py-3 text-right text-slate-300 tabular-nums">{d.actual}</td>
                    <td className={cn(
                      'px-3 py-3 text-right tabular-nums font-medium',
                      d.gapAbsolute > 0 ? 'text-emerald-400' : d.gapAbsolute < -10 ? 'text-red-400' : 'text-amber-400'
                    )}>
                      {d.gapAbsolute > 0 ? '+' : ''}{d.gapAbsolute}
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span className={cn('inline-block px-2 py-0.5 rounded text-[11px] font-medium', rootCauseColor(d.rootCause))}>
                        {rootCauseLabel(d.rootCause)}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center">{trendingIcon(d.trending)}</td>
                    <td className="px-3 py-3 text-slate-400 text-xs max-w-[200px] truncate" title={d.recommendedAction}>
                      {d.recommendedAction}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Section 3: Deviation Heatmap */}
        <Card padding="none">
          <div className="px-5 py-4 border-b border-slate-700/50">
            <h3 className="text-sm font-semibold text-slate-100 tracking-wide">Deviation Heatmap</h3>
            <p className="text-xs text-slate-400 mt-1">Segment x Retailer — Net Sales Index (Actual vs Plan)</p>
          </div>
          <div className="p-5 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="px-3 py-2 text-left text-xs text-slate-400 uppercase tracking-wider">Segment</th>
                  {heatmapRetailers.map(r => (
                    <th key={r} className="px-3 py-2 text-center text-xs text-slate-400 uppercase tracking-wider">
                      {retailerLabel(r)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {heatmapSegments.map(seg => (
                  <tr key={seg}>
                    <td className="px-3 py-1.5 text-slate-300 text-xs font-medium">{segmentLabel(seg)}</td>
                    {heatmapRetailers.map(ret => {
                      const actual = planActuals.find(
                        pa => pa.segmentId === seg && pa.retailerId === ret
                      )
                      const planned = plannedNsIx[seg] ?? 100
                      const nsIx = actual?.netSalesIx ?? planned
                      return (
                        <td key={ret} className="px-1.5 py-1.5">
                          <div
                            className={cn(
                              'rounded-md px-3 py-2 text-center text-xs font-semibold tabular-nums transition-colors',
                              heatmapColor(nsIx, planned)
                            )}
                            title={`Plan: ${planned} | Actual: ${nsIx} | Gap: ${nsIx - planned}`}
                          >
                            {nsIx}
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Legend */}
            <div className="flex items-center gap-5 mt-4 pt-3 border-t border-slate-700/50 text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-blue-600/60" /> Above plan (&gt;+3)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-emerald-600/50" /> On track (&plusmn;3)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-amber-600/50" /> Below plan (-3 to -8)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-red-600/50" /> Critical (&gt;-8)
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
