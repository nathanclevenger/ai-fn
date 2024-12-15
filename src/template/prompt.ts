import type { TemplatePromptGenerator } from '../types/template'

export const generateTemplatePrompt: TemplatePromptGenerator = (
  strings: string[] | TemplateStringsArray,
  ...values: any[]
) => {
  return Array.isArray(strings) ? strings.join('') : String.raw({ raw: strings }, ...values)
}
