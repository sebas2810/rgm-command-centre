import type { MessageParam, Tool } from '@anthropic-ai/sdk/resources/messages'
import { getBedrockClient } from '../lib/bedrock.js'
import { recordBedrockSuccess, recordBedrockFailure } from './health-monitor.js'
import { planValidatorPrompt, rgmExpertPrompt, tradeNarrativePrompt } from './system-prompts.js'
import { createToolHandlers } from '../mcp/tool-registry.js'

// Bedrock model ID — Claude Sonnet 4 (cross-region inference for eu-west-1)
const MODEL = process.env.BEDROCK_MODEL_ID ?? 'eu.anthropic.claude-sonnet-4-20250514-v1:0'
const MAX_TOKENS = 4096

const systemPrompts: Record<string, string> = {
  rgmExpert: rgmExpertPrompt,
  planValidator: planValidatorPrompt,
  tradeNarrative: tradeNarrativePrompt,
}

interface SSECallbacks {
  onText: (delta: string) => void
  onToolStart: (id: string, name: string, input: Record<string, unknown>) => void
  onToolResult: (id: string, result: string) => void
  onDone: (usage: { inputTokens: number; outputTokens: number }) => void
  onError: (error: string) => void
}

type APIMessage = {
  role: 'user' | 'assistant'
  content: string | Array<Record<string, unknown>>
}

type ToolDefinition = {
  name: string
  description: string
  input_schema: Record<string, unknown>
}

export class ServerConversationManager {
  private systemPrompt: string
  private apiMessages: APIMessage[] = []
  private tools: ToolDefinition[]
  private toolHandlers: Record<string, (input: Record<string, unknown>) => Promise<string>>
  private totalTokens = { input: 0, output: 0 }

  constructor(promptKey: string) {
    this.systemPrompt = systemPrompts[promptKey] ?? rgmExpertPrompt
    const { definitions, handlers } = createToolHandlers()
    this.tools = definitions
    this.toolHandlers = handlers
  }

  async processMessage(userMessage: string, callbacks: SSECallbacks): Promise<void> {
    this.apiMessages.push({ role: 'user', content: userMessage })
    await this.processLoop(callbacks)
  }

  private async processLoop(callbacks: SSECallbacks): Promise<void> {
    try {
      const client = getBedrockClient()
      const stream = client.messages.stream({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system: this.systemPrompt,
        messages: this.apiMessages as MessageParam[],
        tools: this.tools as Tool[],
      })

      let fullText = ''
      const toolCalls: Array<{ id: string; name: string; input: Record<string, unknown> }> = []

      // Accumulate from stream events
      stream.on('text', (text) => {
        fullText += text
        callbacks.onText(text)
      })

      // Wait for the full message
      const finalMessage = await stream.finalMessage()
      recordBedrockSuccess()

      // Track tokens
      this.totalTokens.input += finalMessage.usage.input_tokens
      this.totalTokens.output += finalMessage.usage.output_tokens

      // Extract tool_use blocks from the final message
      for (const block of finalMessage.content) {
        if (block.type === 'tool_use') {
          toolCalls.push({
            id: block.id,
            name: block.name,
            input: block.input as Record<string, unknown>,
          })
        }
      }

      if (toolCalls.length > 0) {
        // Build assistant message with content blocks for API history
        const contentBlocks: Array<Record<string, unknown>> = []
        if (fullText) contentBlocks.push({ type: 'text', text: fullText })
        for (const tc of toolCalls) {
          contentBlocks.push({ type: 'tool_use', id: tc.id, name: tc.name, input: tc.input })
        }
        this.apiMessages.push({ role: 'assistant', content: contentBlocks })

        // Execute tools and send results
        const toolResults: Array<Record<string, unknown>> = []
        for (const tc of toolCalls) {
          callbacks.onToolStart(tc.id, tc.name, tc.input)
          const handler = this.toolHandlers[tc.name]
          const result = handler
            ? await handler(tc.input)
            : JSON.stringify({ error: `Unknown tool: ${tc.name}` })
          callbacks.onToolResult(tc.id, result)
          toolResults.push({ type: 'tool_result', tool_use_id: tc.id, content: result })
        }

        this.apiMessages.push({ role: 'user', content: toolResults })

        // Continue the agentic loop
        await this.processLoop(callbacks)
        return
      }

      // No tool calls — final response
      this.apiMessages.push({ role: 'assistant', content: fullText })
      callbacks.onDone({ inputTokens: this.totalTokens.input, outputTokens: this.totalTokens.output })
    } catch (err) {
      recordBedrockFailure()
      callbacks.onError(err instanceof Error ? err.message : 'Unknown error')
    }
  }
}
