import { ListPromptGenerator } from './types'

export const generateListPrompt: ListPromptGenerator = (strings, ...values) => {
  return Array.isArray(strings) 
    ? strings.join('')
    : String.raw({ raw: strings }, ...values)
}