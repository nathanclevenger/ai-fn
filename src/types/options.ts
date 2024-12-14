import { SimpleSchema } from './schema'
import { Model } from './model'

export type BaseOptions<T extends SimpleSchema> = {
  model?: Model
  schema: T
  prompt?: string
  system?: string
  stream?: boolean
  seed?: number
  temperature?: number
  maxTokens?: number
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
}