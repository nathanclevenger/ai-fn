import { expect, test, describe } from 'vitest'
import { generateListPrompt } from '@/list/prompt'

describe('list prompt generator', () => {
  test('generates prompt from template literal', () => {
    const prompt = generateListPrompt`list things to do in Paris`
    expect(prompt).toBe('list things to do in Paris')
  })

  test('handles string array input', () => {
    const prompt = generateListPrompt(['list things to do in ', 'Paris'], 'Paris')
    expect(prompt).toBe('list things to do in Paris')
  })
})
