import { validateListOptions } from './validation'
import { createListStream } from './stream'
import { createListAwait } from './await'
import { DEFAULT_LIST_OPTIONS } from './constants'
import type { ListFunction, ListOptions } from './types'

export function createListFunction(options: ListOptions = DEFAULT_LIST_OPTIONS): ListFunction {
  validateListOptions(options)
  const listStream = createListStream(options)
  const listAwait = createListAwait(options)
  return Object.assign(listStream, { await: listAwait })
}
