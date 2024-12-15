import { expect, test, describe } from 'vitest'
import { createListFunction } from '@/list/create-function'
import { MODELS } from '@/constants/models'

describe('createListFunction', () => {
  test(
    'supports streaming with custom options',
    async () => {
      const customList = createListFunction({
        model: MODELS.FAST,
        system: 'You are a local tour guide',
        seed: 1,
      })

      const items = []
      for await (const item of customList`list 2 places to visit in Paris`) {
        items.push(item)
      }

      expect(items.length).toBe(2)
      expect(items[0]).toBeTruthy()
      expect(items[1]).toBeTruthy()
    },
    {
      timeout: 30000,
    },
  )

  test(
    'supports await with custom options',
    async () => {
      const customList = createListFunction({
        model: MODELS.FAST,
        system: 'You are a local tour guide',
        seed: 2,
      })

      const items = await customList.await`list 2 places to visit in London`

      expect(items.length).toBe(2)
      expect(items[0]).toBeTruthy()
      expect(items[1]).toBeTruthy()
    },
    {
      timeout: 30000,
    },
  )
})
