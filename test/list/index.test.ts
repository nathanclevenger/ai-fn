import { expect, test, describe, vi } from 'vitest'
import { list } from '@/list'
import { streamObject } from 'ai'
import { MODELS } from '@/constants/models'

vi.mock('ai', () => ({
  streamObject: vi.fn(),
  generateObject: vi.fn()
}))

describe('list function', () => {
  test('creates async iterator from template literal', async () => {
    const mockElementStream = {
      async *[Symbol.asyncIterator]() {
        yield { item: 'Visit South Beach' }
        yield { item: 'Try Cuban food' }
      }
    }

    vi.mocked(streamObject).mockResolvedValueOnce({
      elementStream: mockElementStream
    })

    const items = []
    const strings = ['fun things to do in Miami']
    for await (const item of list(strings)) {
      items.push(item)
    }

    expect(items).toEqual(['Visit South Beach', 'Try Cuban food'])
    expect(streamObject).toHaveBeenCalledWith(expect.objectContaining({
      prompt: 'fun things to do in Miami',
      output: 'array'
    }))
  })
})