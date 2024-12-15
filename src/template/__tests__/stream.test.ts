import { describe, it, expect } from 'vitest'
import { createTemplateStream } from '../stream'

describe('createTemplateStream', () => {
  it('should create a streaming function with default options', async () => {
    const prompt = 'write a blog post about AI'
    const stream = await createTemplateStream(prompt)
    expect(stream).toBeDefined()
    expect(typeof stream[Symbol.asyncIterator]).toBe('function')
  })

  it('should create a streaming function with custom options', async () => {
    const prompt = 'write a blog post about AI'
    const options = {
      model: 'gpt-4o-mini',
      temperature: 0.5,
      maxTokens: 1000
    }
    const stream = await createTemplateStream(prompt, options)
    expect(stream).toBeDefined()
    expect(typeof stream[Symbol.asyncIterator]).toBe('function')
  })

  it('should handle streaming chunks', async () => {
    const prompt = 'write a short greeting'
    const chunks: string[] = []
    const stream = await createTemplateStream(prompt)

    for await (const chunk of stream) {
      chunks.push(chunk)
    }

    expect(chunks.length).toBeGreaterThan(0)
    expect(chunks.every(chunk => typeof chunk === 'string')).toBe(true)
  })
})
