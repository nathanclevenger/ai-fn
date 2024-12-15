import { describe, it, expect } from 'vitest'
import { generateTemplatePrompt } from '../prompt'

describe('generateTemplatePrompt', () => {
  it('should handle basic template literals', () => {
    const topic = 'AI'
    const result = generateTemplatePrompt(['write a blog post about ', ''], [topic])
    expect(result).toBe('write a blog post about AI')
  })

  it('should handle multiple interpolations', () => {
    const topic = 'AI'
    const length = 'short'
    const result = generateTemplatePrompt(['write a ', ' blog post about ', ' with proper formatting'], [length, topic])
    expect(result).toBe('write a short blog post about AI with proper formatting')
  })

  it('should handle raw strings without interpolation', () => {
    const result = generateTemplatePrompt(['write a blog post'])
    expect(result).toBe('write a blog post')
  })
})
