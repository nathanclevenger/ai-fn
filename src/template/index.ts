import { QueueManager } from '../queue/manager'
import { AIFunctionOptions } from '../types'
import { createTemplatePrompt } from './prompt'
import { createTemplateStream } from './stream'

const queueManager = new QueueManager()

export function ai(strings: TemplateStringsArray, ...values: any[]) {
  const prompt = createTemplatePrompt(strings, values)

  function withOptions(options: AIFunctionOptions = {}) {
    return queueManager.add(async () => {
      const response = await createTemplatePrompt(strings, values, options)
      return response
    }, { model: options.model })
  }

  // Make the function callable directly or with options
  const templateFunction = async () => withOptions()
  templateFunction.withOptions = withOptions

  // Add async iterator support for streaming
  templateFunction[Symbol.asyncIterator] = () => {
    const stream = createTemplateStream(prompt)
    return {
      async next() {
        const result = await stream.next()
        return {
          done: result.done || false,
          value: result.value || ''
        }
      }
    }
  }

  return Object.assign(templateFunction, {
    [Symbol.asyncIterator]: templateFunction[Symbol.asyncIterator]
  })
}
