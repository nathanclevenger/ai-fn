import { z } from 'zod'

export type ListFunction = {
  (strings: string[] | TemplateStringsArray, ...values: any[]): AsyncIterableIterator<any>
  await: (strings: string[] | TemplateStringsArray, ...values: any[]) => Promise<string[]>
}

export type ListOptions = {
  model?: string
  system?: string
  seed?: number // Change type to number
}