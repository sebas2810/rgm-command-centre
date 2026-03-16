import AnthropicBedrock from '@anthropic-ai/bedrock-sdk'

const AWS_REGION = process.env.AWS_REGION ?? 'eu-west-1'

let _client: AnthropicBedrock | null = null

/**
 * Singleton Bedrock client — lazy-initialized on first use.
 * Uses IAM credential chain (ECS task role in production, aws configure locally).
 */
export function getBedrockClient(): AnthropicBedrock {
  if (!_client) {
    _client = new AnthropicBedrock({
      awsRegion: AWS_REGION,
    })
    console.log(`[Bedrock] Client initialized (region: ${AWS_REGION})`)
  }
  return _client
}

/**
 * Proxy export for backward-compatible usage: `import { bedrock } from './bedrock'`
 * Lazily resolves the client on first property access.
 */
export const bedrock = new Proxy({} as AnthropicBedrock, {
  get: (_target, prop) => {
    const instance = getBedrockClient()
    const val = (instance as unknown as Record<string, unknown>)[prop as string]
    return typeof val === 'function' ? (val as Function).bind(instance) : val
  },
})
