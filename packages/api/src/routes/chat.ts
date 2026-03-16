import { Router } from 'express'
import { ServerConversationManager } from '../services/conversation-manager.js'
import type { Request, Response } from 'express'

export const chatRouter = Router()

// In-memory conversation store (sufficient for demo, no Redis needed)
const conversations = new Map<string, ServerConversationManager>()

chatRouter.post('/chat', async (req: Request, res: Response) => {
  const { message, conversationId, systemPromptKey } = req.body as {
    message: string
    conversationId?: string
    systemPromptKey?: 'rgmExpert' | 'planValidator' | 'tradeNarrative'
  }

  if (!message || typeof message !== 'string') {
    res.status(400).json({ error: 'message is required' })
    return
  }

  // Get or create conversation manager
  const convId = conversationId ?? crypto.randomUUID()
  let manager = conversations.get(convId)
  if (!manager) {
    manager = new ServerConversationManager(systemPromptKey ?? 'rgmExpert')
    conversations.set(convId, manager)
  }

  // Set up SSE response
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'X-Conversation-Id': convId,
  })

  // Send conversation ID as first event
  res.write(`event: conversation_id\ndata: ${JSON.stringify({ id: convId })}\n\n`)

  try {
    await manager.processMessage(message, {
      onText: (delta: string) => {
        res.write(`event: text\ndata: ${JSON.stringify({ delta })}\n\n`)
      },
      onToolStart: (id: string, name: string, input: Record<string, unknown>) => {
        res.write(`event: tool_start\ndata: ${JSON.stringify({ id, name, input })}\n\n`)
      },
      onToolResult: (id: string, result: string) => {
        res.write(`event: tool_result\ndata: ${JSON.stringify({ id, result })}\n\n`)
      },
      onDone: (usage: { inputTokens: number; outputTokens: number }) => {
        res.write(`event: done\ndata: ${JSON.stringify({ usage })}\n\n`)
        res.end()
      },
      onError: (error: string) => {
        res.write(`event: error\ndata: ${JSON.stringify({ message: error })}\n\n`)
        res.end()
      },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    res.write(`event: error\ndata: ${JSON.stringify({ message })}\n\n`)
    res.end()
  }
})

// Clean up old conversations (simple TTL)
setInterval(() => {
  if (conversations.size > 50) {
    const keys = [...conversations.keys()]
    keys.slice(0, keys.length - 20).forEach(k => conversations.delete(k))
  }
}, 60_000)
