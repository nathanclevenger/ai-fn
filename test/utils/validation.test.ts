import { expect, test, describe } from 'vitest'
import { validateSchema } from '@/utils'

describe('schema validation', () => {
  test('validates correct schema', () => {
    const schema = {
      name: 'person name',
      type: 'App | API | Website',
      tags: ['keywords'],
      nested: {
        field: 'description',
      },
    }

    expect(() => validateSchema(schema)).not.toThrow()
  })

  test('throws on invalid schema type', () => {
    const schema = null

    expect(() => validateSchema(schema as any)).toThrow('Schema must be a valid object')
  })

  test('throws on invalid key', () => {
    const schema = {
      '': 'empty key',
    }

    expect(() => validateSchema(schema)).toThrow('Schema keys must be non-empty strings')
  })

  test('throws on invalid value type', () => {
    const schema = {
      count: 42,
    }

    expect(() => validateSchema(schema as any)).toThrow('Schema values must be strings, arrays of strings, or nested objects')
  })

  test('throws on empty array', () => {
    const schema = {
      tags: [],
    }

    expect(() => validateSchema(schema)).toThrow('Array schema values must not be empty')
  })

  test('throws on array with non-string values', () => {
    const schema = {
      tags: ['valid', 42],
    }

    expect(() => validateSchema(schema as any)).toThrow('Array schema values must contain only strings')
  })
})
