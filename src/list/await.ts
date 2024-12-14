import { generateObject } from 'ai'
import { convertToOpenAIModel } from '@/converters'
import { DEFAULT_LIST_OPTIONS } from './constants'
import { generateListPrompt } from './prompt'
import { createArraySchema } from './schemas'
import type { ListAwaitFunction, ListOptions } from './types'

export const createListAwait = (options: ListOptions): ListAwaitFunction => {
  return async function listAwait(strings, ...values) {
    const prompt = generateListPrompt(strings, ...values)
    const model = convertToOpenAIModel(options.model || DEFAULT_LIST_OPTIONS.model)
    const schema = createArraySchema()

    const { object } = await generateObject({
      model,
      schema,
      prompt,
      system: options.system,
      seed: options.seed,
      temperature: 0.7,
      maxTokens: 2000, // Increased for better completion
      retry: {
        attempts: 3,
        delay: 1000,
        factor: 2 // Exponential backoff
      }
    })

    return object.items || []
  }
}