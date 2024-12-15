import { expect, test, describe } from 'vitest'
import { generateObject, streamObject } from '@/index'
import { MODELS } from '@/constants/models'

describe('ai-functions', () => {
  test(
    'generates object with string model',
    async () => {
      const options = {
        model: MODELS.FAST,
        schema: {
          productType: 'App | API | Website',
          description: 'product description',
        },
        prompt: 'Generate a product',
        seed: 1,
      }

      const result = await generateObject(options)
      expect(result.object).toBeDefined()
      expect(result.object.productType).toMatch(/^(App|API|Website)$/)
      expect(result.object.description).toBeTruthy()
    },
    {
      timeout: 30000,
    },
  )

  test(
    'streams object with string model',
    async () => {
      const options = {
        model: MODELS.FAST,
        schema: {
          recipe: {
            name: 'recipe name',
            steps: ['cooking steps'],
          },
        },
        prompt: 'Generate a recipe for spaghetti bolognese',
        seed: 1,
        temperature: 0.7,
        maxTokens: 500, // Smaller context for faster streaming
      }

      const { partialObjectStream } = await streamObject(options)
      const chunks: any[] = []
      let timeoutId: NodeJS.Timeout

      try {
        await new Promise<void>((resolve, reject) => {
          timeoutId = setTimeout(() => reject(new Error('Stream timeout')), 20000)
          ;(async () => {
            try {
              for await (const chunk of partialObjectStream) {
                chunks.push(chunk)
                if (chunk.recipe?.name && chunk.recipe?.steps?.length > 0) {
                  clearTimeout(timeoutId)
                  resolve()
                  break
                }
              }
            } catch (error) {
              clearTimeout(timeoutId)
              reject(error)
            }
          })()
        })
      } finally {
        clearTimeout(timeoutId!)
      }

      expect(chunks.length).toBeGreaterThan(0)
      const lastChunk = chunks[chunks.length - 1]
      expect(lastChunk.recipe).toBeDefined()
      expect(lastChunk.recipe.name || lastChunk.recipe.steps).toBeTruthy()
    },
    {
      timeout: 30000,
    },
  )
})
