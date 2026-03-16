import { sendChatMessage } from './api-client'

export interface ConversationMessage {
  id: string
  role: 'user' | 'assistant' | 'tool'
  content: string
  toolCalls?: ToolCall[]
  isStreaming?: boolean
  timestamp: Date
}

export interface ToolCall {
  id: string
  name: string
  input: Record<string, unknown>
  result?: string
}

export interface ConversationState {
  messages: ConversationMessage[]
  isProcessing: boolean
  error: string | null
  totalTokens: { input: number; output: number }
}

type Listener = (state: ConversationState) => void

export class ConversationManager {
  private conversationId: string | null = null
  private state: ConversationState = {
    messages: [],
    isProcessing: false,
    error: null,
    totalTokens: { input: 0, output: 0 },
  }
  private listeners: Set<Listener> = new Set()
  private systemPromptId: string
  private abortController: AbortController | null = null

  constructor(systemPromptId: string) {
    this.systemPromptId = systemPromptId
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener)
    listener(this.state)
    return () => this.listeners.delete(listener)
  }

  private emit() {
    const snapshot = { ...this.state, messages: [...this.state.messages] }
    this.listeners.forEach(l => l(snapshot))
  }

  private addMessage(msg: Omit<ConversationMessage, 'id' | 'timestamp'>): string {
    const id = `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
    this.state.messages.push({ ...msg, id, timestamp: new Date() })
    this.emit()
    return id
  }

  private updateMessage(id: string, updates: Partial<ConversationMessage>) {
    const idx = this.state.messages.findIndex(m => m.id === id)
    if (idx !== -1) {
      this.state.messages[idx] = { ...this.state.messages[idx], ...updates }
      this.emit()
    }
  }

  getState(): ConversationState {
    return this.state
  }

  async sendUserMessage(content: string): Promise<void> {
    if (this.state.isProcessing) return

    // Add user message
    this.addMessage({ role: 'user', content })

    this.state.isProcessing = true
    this.state.error = null
    this.emit()

    // Create streaming assistant message
    const assistantMsgId = this.addMessage({
      role: 'assistant',
      content: '',
      isStreaming: true,
    })

    let fullText = ''
    const toolCalls: ToolCall[] = []

    this.abortController = new AbortController()

    try {
      await sendChatMessage(
        content,
        this.conversationId,
        this.systemPromptId,
        {
          onConversationId: (id) => {
            this.conversationId = id
          },
          onText: (delta) => {
            fullText += delta
            this.updateMessage(assistantMsgId, { content: fullText })
          },
          onToolStart: (tool) => {
            toolCalls.push({
              id: tool.id,
              name: tool.name,
              input: tool.input,
            })
          },
          onToolResult: (result) => {
            const tc = toolCalls.find(t => t.id === result.id)
            if (tc) tc.result = result.result
          },
          onDone: (usage) => {
            this.state.totalTokens.input += usage.inputTokens
            this.state.totalTokens.output += usage.outputTokens
          },
          onError: (error) => {
            this.state.error = error
            this.emit()
          },
        },
        this.abortController.signal,
      )
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        this.state.error = err instanceof Error ? err.message : 'An error occurred'
      }
    }

    // Finalize assistant message
    this.updateMessage(assistantMsgId, {
      content: fullText,
      isStreaming: false,
      toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
    })

    this.state.isProcessing = false
    this.abortController = null
    this.emit()
  }

  cancel(): void {
    this.abortController?.abort()
  }

  reset(): void {
    this.cancel()
    this.conversationId = null
    this.state = {
      messages: [],
      isProcessing: false,
      error: null,
      totalTokens: { input: 0, output: 0 },
    }
    this.emit()
  }
}
