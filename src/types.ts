import { z } from 'zod'

export type SimpleSchema = {
  [key: string]: SimpleSchemaValue
}

export type SimpleSchemaValue = string | string[] | SimpleSchema

export type GenerateObjectOptions<T extends SimpleSchema> = {
  model: any
  output?: 'single' | 'array'
  schema: T
  prompt: string
}

export type StreamObjectOptions<T extends SimpleSchema> = {
  model: any
  schema: T
  prompt: string
}