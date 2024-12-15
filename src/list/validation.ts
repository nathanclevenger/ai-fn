import { ListOptions } from '@/types/list'

export function validateListOptions(options: ListOptions): void {
  if (options.seed !== undefined && !Number.isInteger(options.seed)) {
    throw new Error('List options seed must be an integer')
  }

  if (options.model !== undefined && typeof options.model !== 'string') {
    throw new Error('List options model must be a string')
  }

  if (options.system !== undefined && typeof options.system !== 'string') {
    throw new Error('List options system must be a string')
  }
}
