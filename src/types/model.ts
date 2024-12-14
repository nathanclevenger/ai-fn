import { OpenAIModel } from '@ai-sdk/openai'

export type Model = string | OpenAIModel

export interface ExtendedOpenAIModel extends OpenAIModel {
  type: 'openai'
  model: string
}