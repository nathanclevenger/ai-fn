import { expect, test, describe } from 'vitest'
import { generatePrompt } from '@/proxy/prompt'

describe('proxy prompt generator', () => {
  test('generates YAML formatted prompt', () => {
    const prompt = generatePrompt('analyze', { text: 'Hello world' })
    expect(prompt).toContain('analyze:')
    expect(prompt).toContain('text: Hello world')
  })

  test('handles nested objects', () => {
    const prompt = generatePrompt('recipe', {
      name: 'Pasta',
      ingredients: ['tomatoes', 'pasta']
    })
    expect(prompt).toContain('recipe:')
    expect(prompt).toContain('name: Pasta')
    expect(prompt).toContain('ingredients:')
    expect(prompt).toContain('  - tomatoes')
    expect(prompt).toContain('  - pasta')
  })
})