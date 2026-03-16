/**
 * Health monitor — tracks Bedrock API call success/failure in a rolling window.
 * Inspired by Execathon's health-monitor pattern.
 */

const MAX_RESULTS = 10
const BEDROCK_RESULTS: boolean[] = []
let lastBedrockSuccess: string | null = null
let lastBedrockError: string | null = null
let totalCalls = 0
let totalFailures = 0

export function recordBedrockSuccess(): void {
  BEDROCK_RESULTS.push(true)
  if (BEDROCK_RESULTS.length > MAX_RESULTS) BEDROCK_RESULTS.shift()
  lastBedrockSuccess = new Date().toISOString()
  totalCalls++
}

export function recordBedrockFailure(): void {
  BEDROCK_RESULTS.push(false)
  if (BEDROCK_RESULTS.length > MAX_RESULTS) BEDROCK_RESULTS.shift()
  lastBedrockError = new Date().toISOString()
  totalCalls++
  totalFailures++
}

export type HealthStatus = 'green' | 'yellow' | 'red' | 'grey'

export interface BedrockHealthSnapshot {
  status: HealthStatus
  successRate: number
  totalCalls: number
  totalFailures: number
  lastSuccess: string | null
  lastError: string | null
  recentResults: boolean[]
}

export function getBedrockHealth(): BedrockHealthSnapshot {
  let status: HealthStatus = 'grey'

  if (BEDROCK_RESULTS.length > 0) {
    const lastThree = BEDROCK_RESULTS.slice(-3)
    if (lastThree.length >= 3 && lastThree.every(r => !r)) {
      status = 'red'
    } else if (!BEDROCK_RESULTS[BEDROCK_RESULTS.length - 1]) {
      status = 'yellow'
    } else {
      status = 'green'
    }
  }

  const successRate = BEDROCK_RESULTS.length > 0
    ? BEDROCK_RESULTS.filter(Boolean).length / BEDROCK_RESULTS.length
    : -1

  return {
    status,
    successRate: Math.round(successRate * 100) / 100,
    totalCalls,
    totalFailures,
    lastSuccess: lastBedrockSuccess,
    lastError: lastBedrockError,
    recentResults: [...BEDROCK_RESULTS],
  }
}
