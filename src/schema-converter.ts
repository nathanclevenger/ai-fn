import { z } from 'zod'
import { SimpleSchema, SimpleSchemaValue } from './types'

export function convertToZodSchema(schema: SimpleSchema): z.ZodObject<any> {
  const zodSchema: Record<string, z.ZodTypeAny> = {}

  for (const [key, value] of Object.entries(schema)) {
    zodSchema[key] = convertValue(value)
  }

  return z.object(zodSchema)
}

function convertValue(value: SimpleSchemaValue): z.ZodTypeAny {
  if (Array.isArray(value)) {
    // If it's an array, create a string array schema with the first item as description
    return z.array(z.string().describe(value[0] || ''))
  } else if (typeof value === 'string') {
    // Check if the string contains enum values (separated by |)
    if (value.includes('|')) {
      const enumValues = value.split('|').map((v) => v.trim())
      return z.enum(enumValues as [string, ...string[]])
    }
    // Otherwise, create a string schema with the value as description
    return z.string().describe(value)
  } else if (typeof value === 'object') {
    // If it's an object, recursively convert it
    return convertToZodSchema(value)
  }

  // Fallback to string
  return z.string()
}
