import { z } from 'zod'
import { ListOptions } from '@/types/list'

export type ListStreamFunction = (strings: string[] | TemplateStringsArray, ...values: any[]) => AsyncIterableIterator<any>
export type ListAwaitFunction = (strings: string[] | TemplateStringsArray, ...values: any[]) => Promise<string[]>

export type ListSchema = z.ZodObject<{
  item: z.ZodString
}>

export type ListArraySchema = z.ZodObject<{
  items: z.ZodArray<z.ZodString>
}>

export type ListPromptGenerator = (strings: string[] | TemplateStringsArray, ...values: any[]) => string
