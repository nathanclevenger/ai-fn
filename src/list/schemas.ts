import { z } from 'zod'
import { ListSchema, ListArraySchema } from './types'

export const createStreamSchema = (): ListSchema =>
  z.object({
    item: z.string().describe('A single item from the requested list'),
  })

export const createArraySchema = (): ListArraySchema =>
  z.object({
    items: z.array(z.string().describe('An item from the requested list')).describe('List of requested items'),
  })
