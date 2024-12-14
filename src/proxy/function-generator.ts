import { stringify } from 'yaml'
import { generateObject, streamObject } from '@/index'
import { SimpleSchema, AIFunctionOptions } from '@/types'

function generatePrompt(functionName: string, args: any): string {
  const yamlArgs = stringify(args, { flowLevel: 1 })
  return `${functionName}:\n${yamlArgs}`
}

export function createAIFunction<T extends SimpleSchema>(
  functionName: string, 
  schema: T, 
  options: AIFunctionOptions = {}
) {
  return async function(input: any) {
    const { seed, ...restInput } = input // Extract seed from input
    const prompt = generatePrompt(functionName, restInput)
    const baseOptions = {
      schema,
      prompt,
      model: options.model || 'gpt-4-turbo',
      system: options.system,
      seed // Pass seed to AI functions
    }

    if (options.stream) {
      return streamObject({
        ...baseOptions
      })
    }

    return generateObject({
      ...baseOptions,
      output: 'single'
    })
  }
}