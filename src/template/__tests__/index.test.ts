import { describe, test, expect, vi } from 'vitest'
import { ai } from '../index'

describe('ai template literal', () => {
  test('basic template literal usage', async () => {
    const topic = 'AI'
    const result = await ai`write about ${topic}`()
    expect(typeof result).toBe('string')
  })

  test('template literal with options', async () => {
    const topic = 'AI'
    const result = await ai`write about ${topic}`({
      model: 'gpt-4o-mini',
      temperature: 0.7,
    })
    expect(typeof result).toBe('string')
  })

  test('streaming support', async () => {
    const topic = 'AI'
    const chunks: string[] = []

    for await (const chunk of ai`write about ${topic}`) {
      chunks.push(chunk)
    }

    expect(chunks.length).toBeGreaterThan(0)
    expect(chunks.every((chunk) => typeof chunk === 'string')).toBe(true)
  })

  test('queue management', async () => {
    const topic = 'AI'
    const promises = Array(5)
      .fill(null)
      .map(() => ai`write about ${topic}`({ model: 'gpt-4o-mini' }))

    const results = await Promise.all(promises)
    expect(results).toHaveLength(5)
    expect(results.every((result) => typeof result === 'string')).toBe(true)
  })
})
