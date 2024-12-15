import { SimpleSchema } from './schema'
import { Model } from './model'
import { QueueOptions } from './queue'
import type { LanguageModelV1CallOptions } from '@ai-sdk/provider'

export type BaseOptions<T extends SimpleSchema> = {
  model?: Model
  schema: T
  prompt?: string
  system?: string
  stream?: boolean
  seed?: number
  temperature?: number
  maxTokens?: number
  queue?: QueueOptions
  providerOptions?: LanguageModelV1CallOptions
}

export type GenerateObjectOptions<T extends SimpleSchema> = BaseOptions<T> & {
  output?: 'single' | 'array'
}

export type StreamObjectOptions<T extends SimpleSchema> = BaseOptions<T>

export type AIFunctionOptions = Partial<LanguageModelV1CallOptions> & {
  stream?: boolean
  system?: string
  model?: Model
  seed?: number
  temperature?: number
  maxTokens?: number
  queue?: QueueOptions
  experimental?: {
    metadata?: Record<string, unknown>
    features?: string[]
  }
}
