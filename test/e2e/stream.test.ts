import { expect, test, describe } from 'vitest'
import { streamObject } from '@/index'
import { MODELS } from '@/constants/models'

describe('streamObject e2e', () => {
  test('streams a recipe', async () => {
    const { partialObjectStream } = await streamObject({
      model: MODELS.BEST,
      schema: {
        recipe: {
          name: 'recipe name',
          ingredients: ['list of ingredients'],
          steps: ['cooking steps']
        }
      },
      prompt: 'Generate a simple pasta recipe',
      seed: 4 // Use integer seed
    })

    const chunks = []
    for await (const chunk of partialObjectStream) {
      chunks.push(chunk)
    }

    expect(chunks).toMatchSnapshot()
  }, {
    timeout: 30000,
    retry: 0
  })
})