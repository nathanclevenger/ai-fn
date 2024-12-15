import { expect, test, describe } from 'vitest'
import { convertToZodSchema } from '../src/schema-converter'
import { z } from 'zod'

describe('schema-converter', () => {
  test('converts simple string schema', () => {
    const input = {
      name: 'person name',
      age: 'person age',
    }

    const schema = convertToZodSchema(input)
    const parsed = schema.safeParse({
      name: 'John',
      age: '30',
    })

    expect(parsed.success).toBe(true)
    if (parsed.success) {
      expect(parsed.data).toEqual({
        name: 'John',
        age: '30',
      })
    }
  })

  test('converts enum schema', () => {
    const input = {
      type: 'App | API | Website',
    }

    const schema = convertToZodSchema(input)
    const parsed = schema.safeParse({
      type: 'App',
    })

    expect(parsed.success).toBe(true)
    const invalidParsed = schema.safeParse({
      type: 'Invalid',
    })
    expect(invalidParsed.success).toBe(false)
  })

  test('converts array schema', () => {
    const input = {
      keywords: ['seo keywords'],
    }

    const schema = convertToZodSchema(input)
    const parsed = schema.safeParse({
      keywords: ['seo', 'optimization'],
    })

    expect(parsed.success).toBe(true)
    if (parsed.success) {
      expect(Array.isArray(parsed.data.keywords)).toBe(true)
    }
  })

  test('converts nested object schema', () => {
    const input = {
      recipe: {
        name: 'recipe name',
        ingredients: ['list of ingredients'],
        steps: ['cooking steps'],
      },
    }

    const schema = convertToZodSchema(input)
    const parsed = schema.safeParse({
      recipe: {
        name: 'Lasagna',
        ingredients: ['pasta', 'cheese'],
        steps: ['prepare', 'cook'],
      },
    })

    expect(parsed.success).toBe(true)
  })
})
