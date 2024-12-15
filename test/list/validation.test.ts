import { expect, test, describe } from 'vitest'
import { validateListOptions } from '@/list/validation'

describe('list options validation', () => {
  test('validates correct options', () => {
    const options = {
      model: 'gpt-4o',
      system: 'You are a guide',
      seed: 1,
    }

    expect(() => validateListOptions(options)).not.toThrow()
  })

  test('throws on non-integer seed', () => {
    const options = {
      seed: 1.5,
    }

    expect(() => validateListOptions(options)).toThrow('List options seed must be an integer')
  })

  test('throws on invalid model type', () => {
    const options = {
      model: 123,
    }

    expect(() => validateListOptions(options as any)).toThrow('List options model must be a string')
  })

  test('throws on invalid system type', () => {
    const options = {
      system: 123,
    }

    expect(() => validateListOptions(options as any)).toThrow('List options system must be a string')
  })
})
