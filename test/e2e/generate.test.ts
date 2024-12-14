import { expect, test, describe } from 'vitest'
import { generateObject } from '@/index'
import { MODELS } from '@/constants/models'

describe('generateObject e2e', () => {
  test('generates a product description', async () => {
    const { object } = await generateObject({
      model: MODELS.BEST,
      schema: {
        name: 'product name',
        type: 'App | API | Website',
        description: 'product description in 10-20 words'
      },
      prompt: 'Generate a description for a weather forecasting product',
      seed: 3 // Use integer seed
    })

    expect(object).toMatchSnapshot()
  }, {
    timeout: 30000,
    retry: 0
  })
})