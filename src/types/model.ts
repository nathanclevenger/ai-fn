import type { OpenAIProvider } from '@ai-sdk/openai'
import type { LanguageModelV1CallOptions } from '@ai-sdk/provider'

type ExtractModelType<T> = T extends (modelId: infer M, ...args: any[]) => any ? M : never
export type OpenAIModelId = ExtractModelType<OpenAIProvider>

export type Model = string | OpenAIModelId | {
  type: string
  model: string
  provider?: string
  settings?: LanguageModelV1CallOptions
}

export interface ExtendedOpenAIModel {
  type: 'openai'
  model: OpenAIModelId | string
  settings?: LanguageModelV1CallOptions
}
