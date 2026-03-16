import { useState, useEffect } from 'react'
import { checkApiHealth } from '../services/api-client'
import { Card } from '../components/ui/Card'

export function SettingsPage() {
  const [apiStatus, setApiStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking')

  useEffect(() => {
    checkApiHealth().then(ok => setApiStatus(ok ? 'connected' : 'disconnected'))
  }, [])

  return (
    <div className="max-w-lg mx-auto py-8">
      <Card padding="lg">
        <h1 className="text-xl font-bold text-white mb-6">Settings</h1>

        {/* ── API Connection Status ── */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-slate-200 mb-1">
            Backend API
          </label>
          <p className="text-xs text-slate-500 mb-4">
            Claude API key is managed server-side. The AI agent and all tool execution runs on the backend.
          </p>

          <div className="flex items-center gap-3">
            <div className="flex-1 bg-slate-800 border border-slate-700/50 rounded-lg px-3 py-2.5 flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                apiStatus === 'connected' ? 'bg-emerald-400' :
                apiStatus === 'disconnected' ? 'bg-red-400' :
                'bg-yellow-400 animate-pulse'
              }`} />
              <span className="text-sm text-slate-300">
                {apiStatus === 'connected' ? 'Connected to API' :
                 apiStatus === 'disconnected' ? 'API unreachable' :
                 'Checking connection...'}
              </span>
            </div>
            <button
              onClick={() => {
                setApiStatus('checking')
                checkApiHealth().then(ok => setApiStatus(ok ? 'connected' : 'disconnected'))
              }}
              className="px-4 py-2.5 rounded-lg bg-slate-700/50 border border-slate-600/50 text-slate-300 text-sm font-medium hover:bg-slate-700 transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* ── Model Info ── */}
        <div className="mb-8 border-t border-slate-700/50 pt-6">
          <h3 className="text-sm font-medium text-slate-200 mb-3">Model Configuration</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Model</span>
              <span className="text-slate-300 font-mono">Claude Sonnet 4 (claude-sonnet-4-20250514)</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Tools</span>
              <span className="text-slate-300">10 RGM analysis tools (MCP server)</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Database</span>
              <span className="text-slate-300">PostgreSQL (17 tables, Prisma ORM)</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Streaming</span>
              <span className="text-slate-300">SSE (Server-Sent Events)</span>
            </div>
          </div>
        </div>

        {/* ── About Section ── */}
        <div className="border-t border-slate-700/50 pt-6">
          <h3 className="text-sm font-medium text-slate-200 mb-3">About</h3>
          <div className="space-y-1.5 text-xs text-slate-500">
            <p className="text-slate-400 font-medium">RGM Command Centre v2.0</p>
            <p>Built with PricingOne Triple Win RGM methodology</p>
            <p>Danone Spain &middot; Yogurt Category &middot; 2026</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
