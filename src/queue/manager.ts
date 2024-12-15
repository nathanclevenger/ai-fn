import PQueue from 'p-queue'
import type { QueueOptions } from '../types'

export class QueueManager {
  private queues: Map<string, PQueue> = new Map()
  private defaultQueue: PQueue
  private options: QueueOptions

  constructor(options: QueueOptions = {}) {
    this.options = options
    this.defaultQueue = new PQueue({
      concurrency: options.concurrency ?? 3,
      timeout: options.timeout ?? 30000,
      autoStart: options.autoStart ?? true
    })
  }

  getQueue(model?: string): PQueue {
    if (!model) return this.defaultQueue

    if (!this.queues.has(model)) {
      this.queues.set(model, new PQueue({
        concurrency: this.options.concurrency ?? 3,
        timeout: this.options.timeout ?? 30000,
        autoStart: this.options.autoStart ?? true
      }))
    }

    return this.queues.get(model)!
  }

  async add<T>(fn: () => Promise<T>, options: { model?: string; priority?: number } = {}): Promise<T> {
    const queue = this.getQueue(options.model)
    return queue.add(fn, { priority: options.priority })
  }

  async onIdle(model?: string): Promise<void> {
    const queue = this.getQueue(model)
    return queue.onIdle()
  }

  pause(model?: string): void {
    const queue = this.getQueue(model)
    queue.pause()
  }

  resume(model?: string): void {
    const queue = this.getQueue(model)
    queue.resume()
  }

  clear(model?: string): void {
    const queue = this.getQueue(model)
    queue.clear()
  }

  size(model?: string): number {
    const queue = this.getQueue(model)
    return queue.size
  }

  pending(model?: string): number {
    const queue = this.getQueue(model)
    return queue.pending
  }
}
