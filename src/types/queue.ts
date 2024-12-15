import { z } from 'zod'

export interface QueueOptions {
  concurrency?: number
  timeout?: number
  retries?: number
  priority?: number
  autoStart?: boolean
}

export const queueOptionsSchema = z.object({
  concurrency: z.number().optional(),
  timeout: z.number().optional(),
  retries: z.number().optional(),
  priority: z.number().optional(),
  autoStart: z.boolean().optional(),
})
