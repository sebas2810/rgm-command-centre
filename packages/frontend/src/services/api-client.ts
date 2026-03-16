// ─── API Client ─────────────────────────────────────────────
// Replaces claude-client.ts — all AI calls go through the backend API
// No more client-side API keys or Anthropic SDK

const API_BASE = '/api'

// ─── Health / readiness ─────────────────────────────────────

export async function checkApiHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/health`)
    const data = await res.json()
    return data.status === 'ok'
  } catch {
    return false
  }
}

// ─── SSE streaming chat ─────────────────────────────────────

export interface ChatSSECallbacks {
  onConversationId?: (id: string) => void
  onText?: (delta: string) => void
  onToolStart?: (tool: { id: string; name: string; input: Record<string, unknown> }) => void
  onToolResult?: (result: { id: string; result: string }) => void
  onDone?: (usage: { inputTokens: number; outputTokens: number }) => void
  onError?: (error: string) => void
}

export async function sendChatMessage(
  message: string,
  conversationId: string | null,
  systemPromptId: string,
  callbacks: ChatSSECallbacks,
  signal?: AbortSignal,
): Promise<void> {
  const response = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      conversationId,
      systemPromptId,
    }),
    signal,
  })

  if (!response.ok) {
    const err = await response.text()
    callbacks.onError?.(err || `HTTP ${response.status}`)
    return
  }

  const reader = response.body?.getReader()
  if (!reader) {
    callbacks.onError?.('No response stream')
    return
  }

  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })

    // Process complete SSE events
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? '' // keep incomplete line in buffer

    let eventType = ''
    let eventData = ''

    for (const line of lines) {
      if (line.startsWith('event: ')) {
        eventType = line.slice(7).trim()
      } else if (line.startsWith('data: ')) {
        eventData = line.slice(6)
      } else if (line === '' && eventType && eventData) {
        // Dispatch complete event
        try {
          const parsed = JSON.parse(eventData)
          switch (eventType) {
            case 'conversation_id':
              callbacks.onConversationId?.(parsed.conversationId)
              break
            case 'text':
              callbacks.onText?.(parsed.delta)
              break
            case 'tool_start':
              callbacks.onToolStart?.(parsed)
              break
            case 'tool_result':
              callbacks.onToolResult?.(parsed)
              break
            case 'done':
              callbacks.onDone?.(parsed.usage)
              break
            case 'error':
              callbacks.onError?.(parsed.error)
              break
          }
        } catch {
          // skip malformed event
        }
        eventType = ''
        eventData = ''
      }
    }
  }
}

// ─── Data endpoints (for direct queries) ─────────────────────

export async function fetchSegments() {
  const res = await fetch(`${API_BASE}/segments`)
  return res.json()
}

export async function fetchBrands() {
  const res = await fetch(`${API_BASE}/brands`)
  return res.json()
}

export async function fetchRetailers() {
  const res = await fetch(`${API_BASE}/retailers`)
  return res.json()
}

export async function fetchDeviations(filters?: { severity?: string; segmentId?: string }) {
  const params = new URLSearchParams()
  if (filters?.severity) params.set('severity', filters.severity)
  if (filters?.segmentId) params.set('segmentId', filters.segmentId)
  const res = await fetch(`${API_BASE}/deviations?${params}`)
  return res.json()
}

export async function fetchPlan() {
  const res = await fetch(`${API_BASE}/plan`)
  return res.json()
}

export async function fetchPromoCalendar() {
  const res = await fetch(`${API_BASE}/promo-calendar`)
  return res.json()
}
