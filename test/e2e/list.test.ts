import { expect, test, describe } from 'vitest'
import { list } from '@/list'

describe('list e2e', () => {
  test('generates a list of items using streaming', async () => {
    const items = []
    for await (const item of list`list 3 popular tourist attractions in Paris`) {
      items.push(item)
    }

    expect(items).toMatchSnapshot()
  }, {
    timeout: 30000,
    retry: 0,
    seed: 1 // Use integer seed
  })

  test('generates a list of items using await', async () => {
    const items = await list.await`list 3 popular tourist attractions in Paris`

    expect(items).toMatchSnapshot()
  }, {
    timeout: 30000,
    retry: 0,
    seed: 2 // Use integer seed
  })
})