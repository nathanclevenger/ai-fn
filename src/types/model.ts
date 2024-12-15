import type { OpenAIProvider } from '@ai-sdk/openai'

type ExtractModelType<T> = T extends (modelId: infer M, ...args: any[]) => any ? M : never
export type OpenAIModelId = ExtractModelType<OpenAIProvider>

export type Model = OpenAIModelId | {
  type: string
  model: string
  [key: string]: unknown
}

export interface ExtendedOpenAIModel {
  type: 'openai'
  model: OpenAIModelId
  [key: string]: unknown
}
