import { SimpleSchema } from '../types'

export function validateSchema(schema: SimpleSchema): void {
  if (!schema || typeof schema !== 'object') {
    throw new Error('Schema must be a valid object')
  }

  Object.entries(schema).forEach(([key, value]) => {
    if (!key || typeof key !== 'string') {
      throw new Error('Schema keys must be non-empty strings')
    }
    validateSchemaValue(value)
  })
}

function validateSchemaValue(value: unknown): void {
  if (Array.isArray(value)) {
    if (value.length === 0) {
      throw new Error('Array schema values must not be empty')
    }
    value.forEach((item) => {
      if (typeof item !== 'string') {
        throw new Error('Array schema values must contain only strings')
      }
    })
  } else if (typeof value === 'object' && value !== null) {
    validateSchema(value as SimpleSchema)
  } else if (typeof value !== 'string') {
    throw new Error('Schema values must be strings, arrays of strings, or nested objects')
  }
}
