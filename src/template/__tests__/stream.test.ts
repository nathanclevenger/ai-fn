import { describe, it, expect, vi } from 'vitest'
import { createTemplateStream } from '../stream'

describe('createTemplateStream', () => {
  it('should create a streaming function with default options', async () => {
    const prompt = 'write a blog post about AI'
    const stream = createTemplateStream(prompt)

    expect(stream).toBeDefined()
    expect(stream[Symbol.asyncIterator]).toBeDefined()
    expect(stream.text).toBeDefined()
    expect(stream.fullStream).toBeDefined()
  })

  it('should create a streaming function with custom options', async () => {
    const prompt = 'write a blog post about AI'
    const options = {
      model: 'gpt-4',
      temperature: 0.5,
      maxTokens: 1000,
      queue: {
        retries: 5,
      },
    }
    const stream = createTemplateStream(prompt, options)

    expect(stream).toBeDefined()
    expect(stream[Symbol.asyncIterator]).toBeDefined()
    expect(stream.text).toBeDefined()
    expect(stream.fullStream).toBeDefined()
  })

  it('should handle streaming chunks', async () => {
    const prompt = 'write a short greeting'
    const mockChunk = { chunk: 'Hello, world!' }

    vi.mock('ai', () => ({
      streamObject: vi.fn().mockImplementation(() => ({
        [Symbol.asyncIterator]: async function* () {
          yield mockChunk
        },
        text: Promise.resolve('Hello, world!'),
        fullStream: {
          [Symbol.asyncIterator]: async function* () {
            yield { type: 'text-delta', textDelta: 'Hello, world!' }
          },
        },
      })),
    }))

    const stream = createTemplateStream(prompt)
    const chunks: Array<Partial<{ chunk: string }>> = []

    for await (const chunk of stream) {
      chunks.push(chunk)
    }

    expect(chunks).toEqual([mockChunk])

    const text = await stream.text
    expect(text).toBe('Hello, world!')

    const fullStreamChunks = []
    for await (const chunk of stream.fullStream) {
      fullStreamChunks.push(chunk)
    }
    expect(fullStreamChunks).toEqual([{ type: 'text-delta', textDelta: 'Hello, world!' }])
  })
})
