import { createOpenAI } from '@ai-sdk/openai'
import { Model } from '../types'

// Create a singleton OpenAI client
let clientInstance: ReturnType<typeof createOpenAI>

export function getOpenAIClient() {
  if (!clientInstance) {
    clientInstance = createOpenAI({
      baseURL: process.env.AI_GATEWAY,
    })
  }
  return clientInstance
}

export function convertToOpenAIModel(model: Model) {
  if (typeof model === 'string') {
    const client = getOpenAIClient()
    return client(model)
  }
  return model
}
