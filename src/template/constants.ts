import { AIFunctionOptions } from '@/types'

export const DEFAULT_TEMPLATE_OPTIONS: AIFunctionOptions = {
  model: 'gpt-4o',
  temperature: 0.7,
  maxTokens: 2000,
  stream: false
}
