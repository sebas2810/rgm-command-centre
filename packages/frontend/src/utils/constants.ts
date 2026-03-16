export const AGENT_COLORS = {
  risk: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400', dot: 'bg-red-500', gradient: 'from-red-500/20 to-transparent' },
  impact: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', dot: 'bg-amber-500', gradient: 'from-amber-500/20 to-transparent' },
  scenarios: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400', dot: 'bg-purple-500', gradient: 'from-purple-500/20 to-transparent' },
  orchestration: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', dot: 'bg-emerald-500', gradient: 'from-emerald-500/20 to-transparent' },
} as const

export const AGENT_CONFIGS = [
  { id: 'risk' as const, name: 'Risk Monitoring Agent', role: 'Sentinel — detects, correlates, quantifies risk', phase: 1 as const, color: AGENT_COLORS.risk },
  { id: 'impact' as const, name: 'Impact Assessment Agent', role: 'Analyst — models full financial damage', phase: 2 as const, color: AGENT_COLORS.impact },
  { id: 'scenarios' as const, name: 'Mitigation Scenarios Agent', role: 'Strategist — generates strategies, facilitates hybrid plans', phase: 3 as const, color: AGENT_COLORS.scenarios },
  { id: 'orchestration' as const, name: 'Orchestration Agent', role: 'Executor — operationalises, monitors, adapts', phase: 4 as const, color: AGENT_COLORS.orchestration },
]

export const SEVERITY_COLORS = {
  critical: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400', badge: 'bg-red-500' },
  high: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400', badge: 'bg-orange-500' },
  medium: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', badge: 'bg-amber-500' },
  low: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', badge: 'bg-emerald-500' },
  resolved: { bg: 'bg-slate-500/10', border: 'border-slate-500/30', text: 'text-slate-400', badge: 'bg-slate-500' },
} as const

export const LEVER_COLORS = {
  'consumer-pricing': { bg: 'bg-blue-500/10', text: 'text-blue-400', fill: '#3b82f6' },
  'pack-architecture': { bg: 'bg-purple-500/10', text: 'text-purple-400', fill: '#8b5cf6' },
  'mix-priorities': { bg: 'bg-emerald-500/10', text: 'text-emerald-400', fill: '#10b981' },
  'promotions': { bg: 'bg-amber-500/10', text: 'text-amber-400', fill: '#f59e0b' },
  'commercial-plans': { bg: 'bg-red-500/10', text: 'text-red-400', fill: '#ef4444' },
} as const

export const TRIPLE_WIN_COLORS = {
  consumer: '#3b82f6',
  manufacturer: '#8b5cf6',
  retailer: '#f59e0b',
} as const

export const STATUS_COLORS = {
  'on-track': 'text-emerald-400',
  'blocked': 'text-red-400',
  'at-risk': 'text-amber-400',
} as const

export const MARGIN_FLOOR = 32.0  // corporate margin floor %
export const TRADE_SPEND_THRESHOLD_K = 400  // Finance approval threshold in K EUR
export const TYPING_SPEED = 35  // chars per second for agent messages
export const MESSAGE_DELAY_BASE = 800  // ms base delay between messages
