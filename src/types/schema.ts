import { z } from 'zod'

export type SimpleSchema = {
  [key: string]: SimpleSchemaValue
}

export type SimpleSchemaValue = string | string[] | SimpleSchema