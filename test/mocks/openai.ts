import { vi } from 'vitest'
import type { LanguageModelV1Message, LanguageModelV1CallOptions, LanguageModelV1Prompt, LanguageModelV1TextPart } from '@ai-sdk/provider'
import { OpenAIProvider } from '@ai-sdk/openai'

const mockProductResponse = {
  productType: 'App',
  description: 'A mobile application for tracking daily tasks',
}

interface ChatMessage {
  role: string
  content: string | { type: string; text: string | number }[]
}

// Helper functions for mock response generation
const getListResponse = async (prompt: LanguageModelV1Prompt | ChatMessage[], options?: LanguageModelV1CallOptions) => {
  const getUserMessageText = (prompt: LanguageModelV1Prompt | ChatMessage[]): string => {
    if (Array.isArray(prompt)) {
      const userMessage = prompt.find((msg) => msg.role === 'user')
      if (!userMessage) return ''

      if (typeof userMessage.content === 'string') {
        return userMessage.content
      }

      if (Array.isArray(userMessage.content)) {
        return userMessage.content
          .map((part) => {
            if (typeof part === 'string') return part
            if ('type' in part && part.type === 'text' && 'text' in part) {
              return String(part.text)
            }
            return ''
          })
          .join(' ')
      }

      return String(userMessage.content)
    }

    return typeof prompt === 'string' ? prompt : JSON.stringify(prompt)
  }

  const getRequestedCount = (text: string): number => {
    const match = text.match(/list\s+(\d+)\s+/i)
    return match ? parseInt(match[1], 10) : 5
  }

  const text = getUserMessageText(prompt)
  const seed = options?.seed ?? 0
  const requestedCount = getRequestedCount(text)

  // Generate consistent landmarks based on location keywords in the prompt
  let items: string[]
  if (text.toLowerCase().includes('new york')) {
    items = ['1. Statue of Liberty', '2. Empire State Building', '3. Central Park', '4. Times Square', '5. Brooklyn Bridge']
  } else if (text.toLowerCase().includes('paris')) {
    items = ['1. Eiffel Tower', '2. Notre-Dame Cathedral', '3. Louvre Museum', '4. Arc de Triomphe', '5. Champs-Élysées']
  } else if (text.toLowerCase().includes('tokyo')) {
    items = ['1. Tokyo Tower', '2. Senso-ji Temple', '3. Shibuya Crossing', '4. Imperial Palace', '5. Meiji Shrine']
  } else if (text.toLowerCase().includes('london')) {
    items = ['1. Big Ben', '2. Tower Bridge', '3. Buckingham Palace', '4. Westminster Abbey', '5. London Eye']
  } else {
    items = ['1. Famous Landmark 1', '2. Historic Site 2', '3. Popular Attraction 3', '4. Tourist Spot 4', '5. Local Monument 5']
  }

  // Only shuffle if seed is not 1 (preserve order for tests)
  const resultItems =
    seed === 1
      ? items.slice(0, requestedCount)
      : [...items]
          .sort((a, b) => {
            const hashA = (seed + a).toString()
            const hashB = (seed + b).toString()
            return hashA.localeCompare(hashB)
          })
          .slice(0, requestedCount)

  return {
    text: resultItems.join('\n'),
    usage: {
      promptTokens: 10,
      completionTokens: 20,
      totalTokens: 30,
    },
  }
}

interface LanguageModelV1Response {
  text: string
  usage: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

const mockAwaitResponse = async (options: LanguageModelV1CallOptions): Promise<LanguageModelV1Response> => {
  const response = await getListResponse(options.prompt, options)
  return {
    text: response.text,
    usage: response.usage,
  }
}

export const mockOpenAIClient = vi.fn().mockImplementation(() => {
  const createClient = (_modelId: string) => ({
    chat: {
      completions: {
        create: vi.fn().mockImplementation(async ({ stream, messages, seed }: { stream?: boolean; messages: ChatMessage[]; seed?: number }) => {
          const formattedMessages = messages.map((msg): LanguageModelV1Message => {
            if (msg.role === 'system') {
              return {
                role: 'system',
                content: typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content),
              } as LanguageModelV1Message
            }

            const content: LanguageModelV1TextPart[] = Array.isArray(msg.content)
              ? msg.content.map((part) => ({
                  type: 'text',
                  text: typeof part.text === 'string' ? part.text : String(part.text),
                }))
              : [{ type: 'text', text: String(msg.content) }]

            return {
              role: msg.role,
              content,
            } as LanguageModelV1Message
          })

          const options: LanguageModelV1CallOptions = {
            prompt: formattedMessages as LanguageModelV1Prompt,
            seed,
            inputFormat: 'messages',
            mode: {
              type: 'regular',
            },
          }

          if (stream) {
            const response = await getListResponse(options.prompt, options)
            const items = response.text.split('\n')

            return {
              data: {
                async *[Symbol.asyncIterator]() {
                  // Yield each item as a separate delta
                  for (const item of items) {
                    yield {
                      choices: [
                        {
                          delta: {
                            content: item + '\n',
                          },
                          finish_reason: null,
                        },
                      ],
                    }
                  }
                  // Final chunk with finish reason
                  yield {
                    choices: [
                      {
                        delta: {},
                        finish_reason: 'stop',
                      },
                    ],
                  }
                },
              },
            }
          }

          const response = await mockAwaitResponse(options)
          return {
            choices: [
              {
                message: {
                  content: response.text,
                  role: 'assistant',
                },
                finish_reason: 'stop',
              },
            ],
            usage: response.usage,
          }
        }),
      },
    },
  })

  const mockProvider = vi.fn().mockImplementation((modelId: string) => createClient(modelId))
  const provider = Object.assign(mockProvider, {
    chat: (modelId: string) => createClient(modelId),
    languageModel: (modelId: string) => createClient(modelId),
    completion: (modelId: string) => createClient(modelId),
  }) as unknown as OpenAIProvider

  return provider
})

vi.mock('@ai-sdk/openai', () => ({
  createOpenAI: () => mockOpenAIClient(),
}))

vi.mock('ai', () => ({
  streamObject: vi.fn().mockImplementation(async (options) => {
    if (options.output === 'no-schema' && options.mode === 'json') {
      const response = await getListResponse([{ role: 'user', content: options.prompt }], {
        seed: options.seed,
        inputFormat: 'messages',
        mode: { type: 'regular' },
        prompt: [{ role: 'user', content: options.prompt }] as LanguageModelV1Prompt,
      })
      const items = response.text.split('\n')
      return {
        partialObjectStream: (async function* () {
          for (const item of items) {
            if (item.trim()) {
              yield {
                type: 'text-delta',
                textDelta: item + '\n',
              }
            }
          }
          yield {
            type: 'finish',
            finishReason: 'stop',
          }
        })(),
      }
    }
    return {
      partialObjectStream: (async function* () {
        yield {
          type: 'object-delta',
          objectDelta: mockProductResponse,
        }
      })(),
    }
  }),
  generateObject: vi.fn().mockImplementation(async (options) => {
    if (options.output === 'no-schema' && options.mode === 'json') {
      const response = await getListResponse([{ role: 'user', content: options.prompt }], {
        seed: options.seed,
        inputFormat: 'messages',
        mode: { type: 'regular' },
        prompt: [{ role: 'user', content: options.prompt }] as LanguageModelV1Prompt,
      })
      return { text: response.text }
    }
    return { object: mockProductResponse }
  }),
}))
