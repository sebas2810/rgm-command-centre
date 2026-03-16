import { annualPlan, segments, strategicChoices } from '../data/danone'
import type { PlanStatus } from '../types/plan'
import type { SegmentId } from '../types/segment'
import type { RetailerGroupId } from '../types/retailer'
import { PageHeader } from '../components/layout/PageHeader'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { SectionHeader } from '../components/ui/SectionHeader'
import { cn } from '../utils/cn'

// ─── Helpers ────────────────────────────────────────────────────────────

const segmentNameMap: Record<SegmentId, string> = Object.fromEntries(
  segments.map(s => [s.id, s.name])
) as Record<SegmentId, string>

const retailerNameMap: Record<RetailerGroupId, string> = {
  carrefour: 'Carrefour',
  ahorramas: 'Ahorramas',
  mercadona: 'Mercadona',
  discounters: 'Discounters',
}

function statusBadgeVariant(status: PlanStatus): 'success' | 'warning' | 'critical' {
  if (status === 'on-track') return 'success'
  if (status === 'at-risk') return 'warning'
  return 'critical'
}

function statusLabel(status: PlanStatus): string {
  if (status === 'on-track') return 'On Track'
  if (status === 'at-risk') return 'At Risk'
  return 'Off Track'
}

function ixColor(ix: number): string {
  if (ix >= 105) return 'text-emerald-400'
  if (ix >= 100) return 'text-emerald-400/70'
  if (ix >= 98) return 'text-amber-400'
  return 'text-red-400'
}

function deltaColor(v: number): string {
  if (v > 0) return 'text-emerald-400'
  if (v < 0) return 'text-red-400'
  return 'text-slate-400'
}

// ─── KPI Card (local, plan-specific) ────────────────────────────────────

function PlanKPICard({
  label,
  ixValue,
  details,
}: {
  label: string
  ixValue: number
  details: string[]
}) {
  return (
    <Card className="relative overflow-hidden">
      <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">
        {label}
      </p>
      <p className={cn('text-3xl font-bold tabular-nums', ixColor(ixValue))}>
        Ix {ixValue}
      </p>
      <div className="flex flex-col gap-0.5 mt-2">
        {details.map((d, i) => (
          <span key={i} className="text-xs text-emerald-400/80 tabular-nums">
            {d}
          </span>
        ))}
      </div>
      <div
        className={cn(
          'absolute top-0 right-0 h-full w-1',
          ixValue >= 100 ? 'bg-emerald-500' : 'bg-amber-500'
        )}
      />
    </Card>
  )
}

// ─── Performance Table ──────────────────────────────────────────────────

function PerformanceTable({
  title,
  subtitle,
  rows,
}: {
  title: string
  subtitle: string
  rows: {
    name: string
    volumeIx: number
    netSalesIx: number
    salesMarginIx: number
    salesMarginDeltaPp: number
    tradeMarginIx: number
    tradeMarginDeltaPp: number
    status: PlanStatus
  }[]
}) {
  return (
    <section>
      <SectionHeader title={title} subtitle={subtitle} />
      <Card padding="none">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700/50">
              <th className="text-left text-[10px] font-medium text-slate-400 uppercase tracking-wider px-4 py-2.5">
                Name
              </th>
              <th className="text-right text-[10px] font-medium text-slate-400 uppercase tracking-wider px-3 py-2.5">
                Volume Ix
              </th>
              <th className="text-right text-[10px] font-medium text-slate-400 uppercase tracking-wider px-3 py-2.5">
                Net Sales Ix
              </th>
              <th className="text-right text-[10px] font-medium text-slate-400 uppercase tracking-wider px-3 py-2.5">
                SM Ix
              </th>
              <th className="text-right text-[10px] font-medium text-slate-400 uppercase tracking-wider px-3 py-2.5">
                TM Ix
              </th>
              <th className="text-center text-[10px] font-medium text-slate-400 uppercase tracking-wider px-3 py-2.5">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr
                key={row.name}
                className={cn(
                  'border-b border-slate-800/50 last:border-b-0 transition-colors',
                  row.status === 'off-track' && 'bg-red-500/5',
                  row.status === 'at-risk' && 'bg-amber-500/5'
                )}
              >
                <td className="px-4 py-2.5 text-sm font-medium text-slate-200">
                  {row.name}
                </td>
                <td
                  className={cn(
                    'text-right px-3 py-2.5 text-sm tabular-nums font-medium',
                    ixColor(row.volumeIx)
                  )}
                >
                  {row.volumeIx}
                </td>
                <td
                  className={cn(
                    'text-right px-3 py-2.5 text-sm tabular-nums font-medium',
                    ixColor(row.netSalesIx)
                  )}
                >
                  {row.netSalesIx}
                </td>
                <td className="text-right px-3 py-2.5">
                  <span
                    className={cn(
                      'text-sm tabular-nums font-medium',
                      ixColor(row.salesMarginIx)
                    )}
                  >
                    {row.salesMarginIx}
                  </span>
                  <span
                    className={cn(
                      'text-[10px] tabular-nums ml-1',
                      deltaColor(row.salesMarginDeltaPp)
                    )}
                  >
                    ({row.salesMarginDeltaPp > 0 ? '+' : ''}
                    {row.salesMarginDeltaPp.toFixed(1)}pp)
                  </span>
                </td>
                <td className="text-right px-3 py-2.5">
                  <span
                    className={cn(
                      'text-sm tabular-nums font-medium',
                      ixColor(row.tradeMarginIx)
                    )}
                  >
                    {row.tradeMarginIx}
                  </span>
                  <span
                    className={cn(
                      'text-[10px] tabular-nums ml-1',
                      deltaColor(row.tradeMarginDeltaPp)
                    )}
                  >
                    ({row.tradeMarginDeltaPp > 0 ? '+' : ''}
                    {row.tradeMarginDeltaPp.toFixed(1)}pp)
                  </span>
                </td>
                <td className="text-center px-3 py-2.5">
                  <Badge variant={statusBadgeVariant(row.status)} size="sm">
                    {statusLabel(row.status)}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </section>
  )
}

// ─── Building Block Bridge ──────────────────────────────────────────────

function BuildingBlockBridge() {
  const blocks = annualPlan.buildingBlocks
  const maxValueM = Math.max(...blocks.map(b => Math.abs(b.valueM)))

  const blockColor = (type: string, color: string) => {
    if (type === 'subtotal') return 'bg-blue-500 border-blue-400/50'
    if (color === 'emerald') return 'bg-emerald-500 border-emerald-400/50'
    if (color === 'teal') return 'bg-teal-500 border-teal-400/50'
    if (color === 'orange') return 'bg-orange-500 border-orange-400/50'
    if (color === 'red') return 'bg-red-500 border-red-400/50'
    return 'bg-slate-500 border-slate-400/50'
  }

  const blockTextColor = (type: string, color: string) => {
    if (type === 'subtotal') return 'text-blue-400'
    if (color === 'emerald' || color === 'teal') return 'text-emerald-400'
    if (color === 'orange' || color === 'red') return 'text-red-400'
    return 'text-slate-400'
  }

  return (
    <section>
      <SectionHeader
        title="Building Block Bridge"
        subtitle="GP contribution by RGM lever — Prior Year to Plan"
      />
      <Card>
        <div className="flex items-end gap-2 overflow-x-auto pb-2">
          {blocks.map(block => {
            const isSubtotal = block.type === 'subtotal'
            const barHeight = isSubtotal
              ? 100
              : Math.max(12, (Math.abs(block.valueM) / maxValueM) * 80)

            return (
              <div
                key={block.id}
                className={cn(
                  'flex flex-col items-center flex-1 min-w-[100px]',
                  isSubtotal && 'min-w-[120px]'
                )}
              >
                {/* Value labels */}
                <div className="text-center mb-2">
                  <p
                    className={cn(
                      'text-sm font-bold tabular-nums',
                      blockTextColor(block.type, block.color)
                    )}
                  >
                    {block.valueM > 0 ? '+' : ''}
                    {block.valueM.toFixed(1)}M
                  </p>
                  {block.valuePp !== 0 && (
                    <p
                      className={cn(
                        'text-[10px] tabular-nums',
                        blockTextColor(block.type, block.color)
                      )}
                    >
                      {block.valuePp > 0 ? '+' : ''}
                      {block.valuePp.toFixed(1)}pp
                    </p>
                  )}
                </div>
                {/* Bar */}
                <div
                  className={cn(
                    'w-full rounded-t-md border-t border-x transition-all',
                    blockColor(block.type, block.color),
                    isSubtotal && 'opacity-90'
                  )}
                  style={{ height: `${barHeight}px` }}
                />
                {/* Label */}
                <div
                  className={cn(
                    'w-full text-center py-2 border-t border-slate-700/50',
                    isSubtotal
                      ? 'bg-slate-800/50 rounded-b-md'
                      : 'bg-slate-900/30 rounded-b-md'
                  )}
                >
                  <p
                    className={cn(
                      'text-[10px] leading-tight',
                      isSubtotal
                        ? 'font-bold text-slate-200'
                        : 'font-medium text-slate-400'
                    )}
                  >
                    {block.label}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
        {/* Legend */}
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-800 text-[10px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded bg-blue-500" />
            Subtotals
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded bg-teal-500" />
            Increases
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded bg-red-500" />
            Decreases
          </div>
        </div>
      </Card>
    </section>
  )
}

// ─── Strategic Choices Summary ──────────────────────────────────────────

function StrategicChoicesSummary() {
  return (
    <section>
      <SectionHeader
        title="Strategic Choices"
        subtitle="Brand roles, strategies, and key actions by segment group"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {strategicChoices.map(group => (
          <Card key={group.groupName}>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-slate-200">
                {group.groupName}
              </h4>
              <Badge variant="default" size="sm">
                {group.wobPct}% WoB
              </Badge>
            </div>
            <div className="space-y-3">
              {group.brands.map(brand => (
                <div
                  key={brand.brandId}
                  className="border-l-2 border-slate-700 pl-3"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-white">
                      {brand.brandName}
                    </span>
                    <Badge
                      variant={
                        brand.strategy === 'Turnaround' ||
                        brand.strategy === 'Fix Profitability'
                          ? 'warning'
                          : brand.strategy === 'Accelerate' ||
                              brand.strategy === 'Maximize'
                            ? 'success'
                            : 'info'
                      }
                      size="sm"
                    >
                      {brand.strategy}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-slate-400 mb-1">
                    <span className="tabular-nums">
                      Share {brand.sharePct}%
                      <span className={deltaColor(brand.shareDeltaPp)}>
                        {' '}
                        ({brand.shareDeltaPp > 0 ? '+' : ''}
                        {brand.shareDeltaPp.toFixed(1)}pp)
                      </span>
                    </span>
                    <span className="tabular-nums">
                      GP {brand.gpPct.toFixed(1)}%
                    </span>
                    <span className="text-slate-500">{brand.profitRole}</span>
                  </div>
                  {brand.actions.length > 0 && (
                    <ul className="space-y-0.5">
                      {brand.actions.map((action, i) => (
                        <li
                          key={i}
                          className="text-[10px] text-slate-500 flex items-start gap-1"
                        >
                          <span className="text-slate-600 mt-px shrink-0">
                            &bull;
                          </span>
                          {action}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}

// ─── Main Page ──────────────────────────────────────────────────────────

export function PlanOverviewPage() {
  const kpis = annualPlan.overallKPIs

  const segmentRows = annualPlan.segmentTargets.map(s => ({
    name: segmentNameMap[s.segmentId] || s.segmentId,
    volumeIx: s.volumeIx,
    netSalesIx: s.netSalesIx,
    salesMarginIx: s.salesMarginIx,
    salesMarginDeltaPp: s.salesMarginDeltaPp,
    tradeMarginIx: s.tradeMarginIx,
    tradeMarginDeltaPp: s.tradeMarginDeltaPp,
    status: s.status,
  }))

  const retailerRows = annualPlan.retailerTargets.map(r => ({
    name: retailerNameMap[r.retailerId] || r.retailerId,
    volumeIx: r.volumeIx,
    netSalesIx: r.netSalesIx,
    salesMarginIx: r.salesMarginIx,
    salesMarginDeltaPp: r.salesMarginDeltaPp,
    tradeMarginIx: r.tradeMarginIx,
    tradeMarginDeltaPp: r.tradeMarginDeltaPp,
    status: r.status,
  }))

  return (
    <div className="space-y-6">
      {/* Section 1: Page Header */}
      <PageHeader title="RGM Plan Overview" subtitle={`Danone Spain \u00B7 Yogurt Category \u00B7 2026`}>
        <Badge variant={statusBadgeVariant(annualPlan.status)} size="md">
          {statusLabel(annualPlan.status)}
        </Badge>
      </PageHeader>

      {/* Section 2: KPI Cards Row */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <PlanKPICard
            label="Volume"
            ixValue={kpis.volumeIx}
            details={[`+${kpis.volumeIx - 100}% vs PY`]}
          />
          <PlanKPICard
            label="Net Sales"
            ixValue={kpis.netSalesIx}
            details={[
              `+\u20AC${kpis.netSalesDeltaM}M`,
              `NS/kg +${kpis.netSalesPerKgDelta}%`,
            ]}
          />
          <PlanKPICard
            label="Sales Margin"
            ixValue={kpis.salesMarginIx}
            details={[`+${kpis.salesMarginDeltaPp}pts`]}
          />
          <PlanKPICard
            label="Trade Margin"
            ixValue={kpis.tradeMarginIx}
            details={[`+${kpis.tradeMarginDeltaPp}pts`]}
          />
        </div>
      </section>

      {/* Section 3: Segment Performance */}
      <PerformanceTable
        title="Segment Performance"
        subtitle={`${annualPlan.segmentTargets.length} segments tracked against plan`}
        rows={segmentRows}
      />

      {/* Section 4: Retailer Performance */}
      <PerformanceTable
        title="Retailer Performance"
        subtitle={`${annualPlan.retailerTargets.length} retailer groups tracked against plan`}
        rows={retailerRows}
      />

      {/* Section 5: Building Block Bridge */}
      <BuildingBlockBridge />

      {/* Section 6: Strategic Choices Summary */}
      <StrategicChoicesSummary />
    </div>
  )
}
