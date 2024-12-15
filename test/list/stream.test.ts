import { expect, test, describe } from 'vitest'
import { createListStream } from '@/list/stream'
import { MODELS } from '@/constants/models'

describe('list stream', () => {
  test(
    'streams items with custom options',
    async () => {
      const listStream = createListStream({
        model: MODELS.FAST,
        system: 'You are a helpful assistant providing clear and concise lists',
        seed: 1,
      })

      const items = []
      for await (const item of listStream(['list 2 major landmarks in Paris'])) {
        items.push(item)
        // Break after 2 items to match test expectation
        if (items.length === 2) break
      }

      expect(items.length).toBe(2)
      expect(items[0]).toBeTruthy()
      expect(items[1]).toBeTruthy()
    },
    {
      timeout: 60000, // Increased timeout for API calls
    },
  )
})
