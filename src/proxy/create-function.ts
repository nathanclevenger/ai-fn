import { generateObject, streamObject } from '@/index'
import { SimpleSchema, AIFunctionOptions } from '@/types'
import { DEFAULT_PROXY_OPTIONS } from './constants'
import { generatePrompt } from './prompt'
import { AIFunction } from './types'

export function createAIFunction<T extends SimpleSchema>(
  functionName: string, 
  schema: T, 
  options: AIFunctionOptions = {}
): AIFunction<T> {
  return async function(input: any) {
    const { seed, ...restInput } = input
    const prompt = generatePrompt(functionName, restInput)
    const baseOptions = {
      schema,
      prompt,
      model: options.model || DEFAULT_PROXY_OPTIONS.model,
      system: options.system,
      seed: parseInt(seed || '1', 10) // Convert seed to integer
    }

    if (options.stream) {
      return streamObject(baseOptions)
    }

    return generateObject({
      ...baseOptions,
      output: 'single'
    })
  }
}