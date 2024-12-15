import { z } from 'zod'
import { TemplateSchema, TemplateStreamSchema } from './types'

export const createSchema = (): TemplateSchema =>
  z.object({
    content: z.string().describe('The generated content'),
  })

export const createStreamSchema = (): TemplateStreamSchema =>
  z.object({
    chunk: z.string().describe('A chunk of the generated content'),
  })
