import { stringify } from 'yaml'

export function generatePrompt(functionName: string, args: any): string {
  const yamlArgs = stringify(args, { flowLevel: 1 })
  return `${functionName}:\n${yamlArgs}`
}