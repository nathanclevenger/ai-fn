import { stringify } from 'yaml'

export function generatePrompt(functionName: string, args: any): string {
  const yamlArgs = stringify(args, { flowStyle: 'flow' })
  return `${functionName}:\n${yamlArgs}`
}
