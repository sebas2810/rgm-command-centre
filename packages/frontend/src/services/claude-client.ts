// ─── Compatibility shim ─────────────────────────────────────
// The API key is now managed server-side. These functions maintain
// backward compatibility with components that reference them.

export function getApiKey(): string | null {
  return 'server-managed'
}

export function setApiKey(_key: string): void {
  // No-op: key is on the server
}

export function clearApiKey(): void {
  // No-op
}

export function hasApiKey(): boolean {
  return true // Always true — backend manages the key
}

export function resetClient(): void {
  // No-op
}

export interface Message {
  role: 'user' | 'assistant'
  content: string | ContentBlock[]
}

export interface ContentBlock {
  type: 'text' | 'tool_use' | 'tool_result'
  text?: string
  id?: string
  name?: string
  input?: Record<string, unknown>
  tool_use_id?: string
  content?: string
}

export interface ToolDefinition {
  name: string
  description: string
  input_schema: Record<string, unknown>
}
