import { expect, test, describe } from 'vitest'
import { createListAwait } from '@/list/await'
import { MODELS } from '@/constants/models'

describe('list await', () => {
  test(
    'returns items with custom options',
    async () => {
      const listAwait = createListAwait({
        model: MODELS.FAST,
        system: 'You are a helpful assistant providing clear and concise lists',
        seed: 2,
      })

      const items = await listAwait(['list 2 major landmarks in London'])

      expect(items.length).toBe(2)
      expect(items[0]).toBeTruthy()
      expect(items[1]).toBeTruthy()
    },
    {
      timeout: 60000, // Increased timeout for API calls
    },
  )
})
