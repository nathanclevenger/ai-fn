import { SimpleSchema, AIFunctionOptions } from '@/types'
import { createAIFunction } from './create-function'

export function createAIProxy() {
  return new Proxy({}, {
    get: (_, functionName: string) => {
      return <T extends SimpleSchema>(schema: T, options: AIFunctionOptions = {}) => {
        return createAIFunction(functionName, schema, options)
      }
    }
  })
}