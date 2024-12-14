import { generateObject as aiGenerateObject } from 'ai'
import { convertToZodSchema, convertToOpenAIModel } from '@/converters'
import { validateSchema } from '@/utils'
import type { GenerateObjectOptions, SimpleSchema } from '@/types'

export async function generateObject<T extends SimpleSchema>(options: GenerateObjectOptions<T>) {
  validateSchema(options.schema)
  const zodSchema = convertToZodSchema(options.schema)
  const model = options.model ? convertToOpenAIModel(options.model) : convertToOpenAIModel('gpt-4-turbo')
  
  return aiGenerateObject({
    ...options,
    model,
    schema: zodSchema,
    temperature: options.temperature ?? 0.7,
    maxTokens: options.maxTokens ?? 1000,
    seed: typeof options.seed === 'number' ? options.seed : undefined
  })
}