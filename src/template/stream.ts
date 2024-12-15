import { streamObject } from 'ai'
import { convertToOpenAIModel } from '@/converters'
import { AIFunctionOptions } from '@/types'
import { DEFAULT_TEMPLATE_OPTIONS } from './constants'
import { createStreamSchema } from './schemas'

/**
 * Creates a streaming template function that returns chunks via AsyncIterator
 */
export const createTemplateStream = (prompt: string, options: AIFunctionOptions = {}) => {
  const model = convertToOpenAIModel(options.model || DEFAULT_TEMPLATE_OPTIONS.model)
  const schema = createStreamSchema()

  return streamObject({
    model,
    schema,
    prompt,
    system: options.system,
    temperature: options.temperature ?? DEFAULT_TEMPLATE_OPTIONS.temperature,
    maxTokens: options.maxTokens ?? DEFAULT_TEMPLATE_OPTIONS.maxTokens,
    retry: {
      attempts: 3,
      delay: 1000,
      factor: 2 // Exponential backoff
    }
  })
}
