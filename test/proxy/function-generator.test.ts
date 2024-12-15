import { expect, test, describe, vi } from 'vitest'
import { createAIFunction, createAIProxy } from '@/proxy'
import { generateObject, streamObject } from '@/index'

vi.mock('@/index', () => ({
  generateObject: vi.fn(),
  streamObject: vi.fn(),
}))

describe('AI Function Generator', () => {
  test('creates function with YAML prompt', async () => {
    const schema = {
      type: 'App | API | Website',
      description: 'product description',
    }

    const fn = createAIFunction('categorizeProduct', schema)
    await fn({ name: 'Test Product', type: 'App' })

    expect(generateObject).toHaveBeenCalledWith(
      expect.objectContaining({
        prompt: expect.stringContaining('categorizeProduct:'),
        schema,
      }),
    )
  })

  // ... rest of the tests
})
