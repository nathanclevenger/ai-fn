import { z } from 'zod'
import { AIFunctionOptions } from './options'

/**
 * Template function type that supports:
 * 1. Basic await: const post = await ai`write a blog post about ${topic}`
 * 2. Config object: const post = await ai`write a blog post about ${topic}`({ model: 'gpt-4o-mini' })
 * 3. Streaming: for await (const chunk of ai`write a blog post about ${topic}`) { console.log(chunk) }
 */
export type TemplateFunction = {
  (strings: string[] | TemplateStringsArray, ...values: any[]): Promise<string>
  (options: AIFunctionOptions): Promise<string>
  [Symbol.asyncIterator](): AsyncIterator<string>
}

/**
 * Schema types for template responses
 */
export type TemplateSchema = z.ZodObject<{
  content: z.ZodString
}>

export type TemplateStreamSchema = z.ZodObject<{
  chunk: z.ZodString
}>

/**
 * Function to generate prompts from template literals
 */
export type TemplatePromptGenerator = (strings: string[] | TemplateStringsArray, ...values: any[]) => string
