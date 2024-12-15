import { streamObject as aiStreamObject } from 'ai'
import { convertToZodSchema, convertToOpenAIModel } from '@/converters'
import { validateSchema } from '@/utils'
import type { StreamObjectOptions, SimpleSchema } from '@/types'

export async function streamObject<T extends SimpleSchema>(options: StreamObjectOptions<T>) {
  validateSchema(options.schema)
  const zodSchema = convertToZodSchema(options.schema)
  const model = options.model ? convertToOpenAIModel(options.model) : convertToOpenAIModel('gpt-4-turbo')

  const streamOptions = {
    ...options,
    model,
    schema: zodSchema,
    temperature: options.temperature ?? 0.7,
    maxTokens: options.maxTokens ?? 1000,
    seed: typeof options.seed === 'number' ? options.seed : undefined,
    // Add retry options for more reliable streaming
    retry: {
      attempts: 3,
      delay: 1000,
    },
  }

  return aiStreamObject(streamOptions)
}
