import { expect, test, describe } from 'vitest'
import { ai } from '@/index'

describe('AI Proxy e2e', () => {
  test('creates and uses AI function', async () => {
    const analyzeText = ai.analyzeText({
      sentiment: 'positive | negative | neutral',
      topics: ['main topics discussed'],
      summary: 'brief summary in 2-3 sentences'
    })

    const result = await analyzeText({
      text: 'AI technology has made remarkable progress in recent years, enabling new applications and possibilities. While there are challenges to address, the potential benefits for society are significant.',
      seed: 5 // Use integer seed
    })

    expect(result.object).toMatchSnapshot()
  }, {
    timeout: 30000,
    retry: 0
  })
})