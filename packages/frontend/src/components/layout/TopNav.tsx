import { useLocation } from 'react-router-dom'

const pageTitles: Record<string, string> = {
  '/plan': 'RGM Plan Overview',
  '/monitor': 'Deviation Monitor',
  '/analytics': 'Deep Dive Analytics',
  '/scenarios': 'Scenario Engine',
  '/retailer-plans': 'Retailer Execution Plans',
  '/settings': 'Settings',
}

export function TopNav() {
  const location = useLocation()
  const title = pageTitles[location.pathname] || 'RGM Command Centre'

  return (
    <header className="h-14 border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm flex items-center px-6 shrink-0">
      <h2 className="text-sm font-semibold text-white">{title}</h2>
      <div className="ml-auto flex items-center gap-4">
        <span className="text-xs text-slate-500">
          {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
        </span>
        <div className="h-6 w-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
          <span className="text-emerald-400 text-xs">{'\u25CF'}</span>
        </div>
      </div>
    </header>
  )
}
