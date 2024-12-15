import { streamObject, type ObjectStreamPart } from 'ai'
import { convertToOpenAIModel } from '../converters'
import type { AIFunctionOptions } from '../types/options'
import { DEFAULT_TEMPLATE_OPTIONS } from './constants'
import { z } from 'zod'

interface ChunkSchema {
  chunk: string
}

type StreamResult = AsyncIterable<Partial<ChunkSchema>> & {
  text: Promise<string>
  fullStream: AsyncIterable<ObjectStreamPart<Partial<ChunkSchema>>> & ReadableStream<ObjectStreamPart<Partial<ChunkSchema>>>
}

/**
 * Creates a streaming template function that returns chunks via AsyncIterator
 */
export const createTemplateStream = (
  prompt: string,
  options: AIFunctionOptions = {}
): StreamResult => {
  const model = convertToOpenAIModel(options.model || DEFAULT_TEMPLATE_OPTIONS.model)
  const chunkSchema = z.object({ chunk: z.string() })

  const stream = streamObject<ChunkSchema>({
    model,
    schema: chunkSchema,
    prompt,
    system: options.system,
    temperature: options.temperature ?? DEFAULT_TEMPLATE_OPTIONS.temperature,
    maxTokens: options.maxTokens ?? DEFAULT_TEMPLATE_OPTIONS.maxTokens,
    maxRetries: options.queue?.retries ?? 3
  })

  const result: StreamResult = {
    async *[Symbol.asyncIterator]() {
      for await (const part of stream.partialObjectStream) {
        yield part
      }
    },
    text: stream.object.then(obj => obj.chunk),
    fullStream: stream.fullStream
  }

  return result
}
