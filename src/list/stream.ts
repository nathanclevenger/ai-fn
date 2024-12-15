import { streamObject } from 'ai'
import { convertToOpenAIModel } from '@/converters'
import { DEFAULT_LIST_OPTIONS } from './constants'
import { generateListPrompt } from './prompt'
import { createStreamSchema } from './schemas'
import type { ListStreamFunction, ListOptions } from './types'

export const createListStream = (options: ListOptions): ListStreamFunction => {
  return async function* listStream(strings, ...values) {
    const prompt = generateListPrompt(strings, ...values)
    const model = convertToOpenAIModel(options.model || DEFAULT_LIST_OPTIONS.model)
    const schema = createStreamSchema()

    const { elementStream } = await streamObject({
      model,
      output: 'array',
      schema,
      prompt,
      system: options.system,
      seed: options.seed,
      temperature: 0.7,
      maxTokens: 2000, // Increased for better completion
      retry: {
        attempts: 3,
        delay: 1000,
        factor: 2, // Exponential backoff
      },
    })

    for await (const element of elementStream) {
      if (element?.item) {
        yield element.item
      }
    }
  }
}
