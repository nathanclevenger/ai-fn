import { SimpleSchema } from './schema'
import { Model } from './model'
import { QueueOptions } from './queue'

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
  providerOptions?: Record<string, unknown>
}

export type GenerateObjectOptions<T extends SimpleSchema> = BaseOptions<T> & {
  output?: 'single' | 'array'
}

export type StreamObjectOptions<T extends SimpleSchema> = BaseOptions<T>

export type AIFunctionOptions = {
  stream?: boolean
  system?: string
  model?: Model
  seed?: number
  temperature?: number
  maxTokens?: number
  queue?: QueueOptions
  providerOptions?: Record<string, unknown>
  experimental?: {
    metadata?: Record<string, unknown>
    features?: string[]
  }
}
