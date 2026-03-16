import { NavLink } from 'react-router-dom'
import { cn } from '../../utils/cn'

const navItems = [
  { to: '/plan', label: 'Plan Overview', icon: '\u25A3' },
  { to: '/monitor', label: 'Deviation Monitor', icon: '\u25C8' },
  { to: '/analytics', label: 'Analytics', icon: '\u25C7' },
  { to: '/scenarios', label: 'Scenario Engine', icon: '\u25C6' },
  { to: '/retailer-plans', label: 'Retailer Plans', icon: '\u25CB' },
  { to: '/settings', label: 'Settings', icon: '\u2699' },
]

export function Sidebar() {
  return (
    <aside className="w-56 border-r border-slate-800 bg-slate-950 flex flex-col">
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">P1</span>
          </div>
          <div>
            <h1 className="text-sm font-bold text-white">PricingOne</h1>
            <p className="text-[10px] text-slate-500">RGM Command Centre</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
              isActive
                ? 'bg-slate-800 text-white font-medium'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            )}
          >
            <span className="text-xs">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-slate-800">
        <div className="flex items-center gap-2 px-3 py-2">
          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
            <span className="text-white text-[10px] font-bold">SM</span>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-200">Sarah Mitchell</p>
            <p className="text-[10px] text-slate-500">RGM Manager</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
