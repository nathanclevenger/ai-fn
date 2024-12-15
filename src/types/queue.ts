import type { OpenAIProvider } from '@ai-sdk/openai'

// Extract model type from OpenAI provider
type ExtractModelType<T> = T extends (modelId: infer M, ...args: any[]) => any ? M : never
export type OpenAIModelId = ExtractModelType<OpenAIProvider>

export type QueueOptions = {
  concurrency?: number
  timeout?: number
  retries?: number
  priority?: number
  autoStart?: boolean
}

export type Model = OpenAIModelId | {
  type: string
  model: string
  [key: string]: unknown
}

export type ExtendedAIFunctionOptions = {
  model?: Model
  system?: string
  temperature?: number
  maxTokens?: number
  queue?: QueueOptions
  providerOptions?: Record<string, unknown>
  experimental?: {
    metadata?: Record<string, unknown>
    features?: string[]
  }
}
