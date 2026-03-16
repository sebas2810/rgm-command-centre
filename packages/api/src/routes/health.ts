import { Router } from 'express'
import { getBedrockHealth } from '../services/health-monitor.js'

export const healthRouter = Router()

healthRouter.get('/health', (_req, res) => {
  const bedrock = getBedrockHealth()

  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    platform: 'Amazon Bedrock',
    region: process.env.AWS_REGION ?? 'eu-west-1',
    model: process.env.BEDROCK_MODEL_ID ?? 'eu.anthropic.claude-sonnet-4-20250514-v1:0',
    knowledgeBase: process.env.BEDROCK_KNOWLEDGE_BASE_ID ? 'configured' : 'not configured',
    bedrock: {
      status: bedrock.status,
      successRate: bedrock.successRate,
      totalCalls: bedrock.totalCalls,
      lastSuccess: bedrock.lastSuccess,
      lastError: bedrock.lastError,
    },
  })
})
