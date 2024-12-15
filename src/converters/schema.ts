import { z } from 'zod'
import { SimpleSchema, SimpleSchemaValue } from '../types'

function convertValue(value: SimpleSchemaValue): z.ZodTypeAny {
  if (Array.isArray(value)) {
    return z.array(z.string().describe(value[0] || ''))
  } else if (typeof value === 'string') {
    if (value.includes('|')) {
      const enumValues = value.split('|').map((v) => v.trim())
      return z.enum(enumValues as [string, ...string[]])
    }
    return z.string().describe(value)
  } else if (typeof value === 'object') {
    return convertToZodSchema(value)
  }
  return z.string()
}

export function convertToZodSchema(schema: SimpleSchema): z.ZodObject<any> {
  const zodSchema: Record<string, z.ZodTypeAny> = {}

  for (const [key, value] of Object.entries(schema)) {
    zodSchema[key] = convertValue(value)
  }

  return z.object(zodSchema)
}
