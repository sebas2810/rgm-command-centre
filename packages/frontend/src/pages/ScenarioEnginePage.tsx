import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ConversationManager, type ConversationMessage, type ConversationState, type ToolCall } from '../services/conversation-manager'

// ─── Suggested Prompts ───────────────────────────────────────────────
const suggestedPrompts = [
  'What are the key deviations from our annual plan?',
  'How should we fix the Bifidus decline at Carrefour?',
  'Simulate pricing up Activia by 3% at Mercadona',
  'Generate a retailer action plan for Ahorramas',
]

// ─── Markdown-lite Renderer ──────────────────────────────────────────
function renderFormattedText(text: string) {
  const lines = text.split('\n')
  return lines.map((line, i) => {
    // Bold
    const withBold = line.replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
    // Bullet points
    if (/^\s*[-*]\s/.test(line)) {
      const content = line.replace(/^\s*[-*]\s/, '')
      const formatted = content.replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
      return (
        <div key={i} className="flex gap-2 ml-2">
          <span className="text-slate-500 select-none">•</span>
          <span dangerouslySetInnerHTML={{ __html: formatted }} />
        </div>
      )
    }
    // Numbered lists
    if (/^\s*\d+\.\s/.test(line)) {
      const match = line.match(/^\s*(\d+)\.\s(.*)/)
      if (match) {
        const formatted = match[2].replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
        return (
          <div key={i} className="flex gap-2 ml-2">
            <span className="text-slate-500 select-none min-w-[1.2em] text-right">{match[1]}.</span>
            <span dangerouslySetInnerHTML={{ __html: formatted }} />
          </div>
        )
      }
    }
    // Headers (###)
    if (/^###\s/.test(line)) {
      return <div key={i} className="text-white font-semibold mt-3 mb-1">{line.replace(/^###\s/, '')}</div>
    }
    if (/^##\s/.test(line)) {
      return <div key={i} className="text-white font-bold text-lg mt-3 mb-1">{line.replace(/^##\s/, '')}</div>
    }
    // Empty line
    if (!line.trim()) return <div key={i} className="h-2" />
    // Regular text with bold
    return <div key={i} dangerouslySetInnerHTML={{ __html: withBold }} />
  })
}

// ─── Tool Call Display ───────────────────────────────────────────────
function ToolCallSection({ toolCalls }: { toolCalls: ToolCall[] }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="mt-2 border-t border-slate-600 pt-2">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-300 transition-colors"
      >
        <svg className={`w-3 h-3 transition-transform ${expanded ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        {toolCalls.length} tool call{toolCalls.length !== 1 ? 's' : ''}
      </button>
      {expanded && (
        <div className="mt-2 space-y-2">
          {toolCalls.map(tc => (
            <div key={tc.id} className="bg-slate-800/50 rounded p-2 text-xs font-mono">
              <div className="text-purple-400 font-semibold">{tc.name}</div>
              <div className="text-slate-500 mt-1 truncate max-w-full">
                Input: {JSON.stringify(tc.input).slice(0, 120)}{JSON.stringify(tc.input).length > 120 ? '...' : ''}
              </div>
              {tc.result && (
                <div className="text-slate-500 mt-1 truncate max-w-full">
                  Result: {tc.result.slice(0, 120)}{tc.result.length > 120 ? '...' : ''}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Streaming Indicator ─────────────────────────────────────────────
function StreamingDots() {
  return (
    <span className="inline-flex gap-1 ml-1">
      <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
      <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
      <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
    </span>
  )
}

// ─── Message Bubble ──────────────────────────────────────────────────
function MessageBubble({ message }: { message: ConversationMessage }) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      <div
        className={`max-w-[90%] rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? 'bg-blue-600 text-white rounded-br-sm'
            : 'bg-slate-700 text-slate-200 rounded-bl-sm'
        }`}
      >
        {isUser ? (
          <span>{message.content}</span>
        ) : (
          <div className="space-y-0.5">
            {renderFormattedText(message.content)}
            {message.isStreaming && !message.content && <StreamingDots />}
          </div>
        )}
        {message.isStreaming && message.content && <StreamingDots />}
        {message.toolCalls && message.toolCalls.length > 0 && (
          <ToolCallSection toolCalls={message.toolCalls} />
        )}
      </div>
    </div>
  )
}

// ─── Main Page Component ─────────────────────────────────────────────
export default function ScenarioEnginePage() {
  const [convState, setConvState] = useState<ConversationState>({
    messages: [],
    isProcessing: false,
    error: null,
    totalTokens: { input: 0, output: 0 },
  })
  const [input, setInput] = useState('')
  const managerRef = useRef<ConversationManager | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Create manager on mount
  useEffect(() => {
    const manager = new ConversationManager('rgm-expert')
    managerRef.current = manager
    const unsub = manager.subscribe(setConvState)
    return () => {
      unsub()
      managerRef.current = null
    }
  }, [])

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [convState.messages])

  const handleSend = useCallback((text?: string) => {
    const msg = (text ?? input).trim()
    if (!msg || !managerRef.current || convState.isProcessing) return
    setInput('')
    managerRef.current.sendUserMessage(msg)
  }, [input, convState.isProcessing])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }, [handleSend])

  const apiKeyConfigured = true // Server-side API key
  const hasMessages = convState.messages.length > 0

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-4 p-4">
      {/* ─── Left Column: Chat ──────────────────────────────────────── */}
      <div className="w-[480px] flex flex-col bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-500" />
            <h2 className="text-lg font-semibold text-slate-100">RGM Expert Agent</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">Powered by Claude</p>
        </div>

        {/* API Key Warning */}
        {!apiKeyConfigured && (
          <div className="mx-4 mt-4 p-3 bg-amber-900/30 border border-amber-700/50 rounded-lg text-sm text-amber-300">
            Configure your Anthropic API key in{' '}
            <Link to="/settings" className="underline hover:text-amber-200">Settings</Link>
            {' '}to enable the RGM Expert Agent.
          </div>
        )}

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {/* Suggested Prompts (before first message) */}
          {!hasMessages && apiKeyConfigured && (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <div className="text-center mb-2">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                  </svg>
                </div>
                <p className="text-slate-400 text-sm">Ask the RGM Expert about pricing, promotions, or retailer strategies</p>
              </div>
              <div className="grid grid-cols-1 gap-2 w-full max-w-sm">
                {suggestedPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSend(prompt)}
                    className="text-left text-sm px-3 py-2.5 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 hover:border-purple-500/30 rounded-lg text-slate-300 hover:text-slate-100 transition-all"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Message List */}
          {hasMessages && convState.messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}

          {/* Error Display */}
          {convState.error && (
            <div className="mb-3 flex justify-start">
              <div className="max-w-[90%] rounded-xl px-4 py-2.5 text-sm bg-red-900/40 border border-red-700/50 text-red-300 rounded-bl-sm">
                <span className="font-semibold">Error:</span> {convState.error}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="px-4 pb-4 pt-2 border-t border-slate-700">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={apiKeyConfigured ? 'Ask the RGM Expert...' : 'API key required'}
              disabled={!apiKeyConfigured || convState.isProcessing}
              className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              onClick={() => handleSend()}
              disabled={!apiKeyConfigured || convState.isProcessing || !input.trim()}
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-700 disabled:text-slate-500 text-white text-sm font-medium rounded-lg transition-colors disabled:cursor-not-allowed"
            >
              {convState.isProcessing ? (
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ─── Right Column: Results Panel ────────────────────────────── */}
      <div className="flex-1 flex flex-col bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-700">
          <h2 className="text-lg font-semibold text-slate-100">Scenario Results</h2>
        </div>

        {/* Placeholder */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 rounded-2xl bg-slate-700/50 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
              </svg>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Ask the RGM Expert Agent to generate scenarios, price simulations, or retailer plans. Results will appear here.
            </p>
          </div>
        </div>

        {/* Token Counter */}
        <div className="px-5 py-3 border-t border-slate-700 text-xs text-slate-500 flex justify-end gap-4">
          <span>Input tokens: {convState.totalTokens.input.toLocaleString()}</span>
          <span>Output tokens: {convState.totalTokens.output.toLocaleString()}</span>
        </div>
      </div>
    </div>
  )
}
